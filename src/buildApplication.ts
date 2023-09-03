import { ZodError } from "zod";
import { ExpressApplication } from "./express";
import { TypesafeHandler } from "./type-safe";

type TypeSafeApplicationOverrides<Application extends ExpressApplication> = {
  delete: TypesafeHandler<Application>;
  get: TypesafeHandler<Application>;
  patch: TypesafeHandler<Application>;
  post: TypesafeHandler<Application>;
  put: TypesafeHandler<Application>;
};

type TypeSafeApplication<Application extends ExpressApplication> = Application &
  TypeSafeApplicationOverrides<Application>;

type ApplicationRouteHandlerMethods<Application extends ExpressApplication> =
  Pick<Application, "get" | "post" | "patch" | "put" | "delete">;

export const buildApplication = <Application extends ExpressApplication>(
  express: () => Application,
): TypeSafeApplication<Application> => {
  const application = express();
  const methodsToOverride: Array<
    keyof ApplicationRouteHandlerMethods<Application>
  > = ["get", "post", "put", "patch", "delete"];

  for (const method of methodsToOverride) {
    const originalMethod = application[method].bind(
      application,
    ) as Application[typeof method];

    const typeSafeMethod: TypesafeHandler<Application> = (
      route,
      cb,
      validators,
    ) => {
      originalMethod(route, async (req, res) => {
        try {
          const validatedQuery = validators?.query?.parse(req.query);
          const validatedBody = validators?.body?.parse(req.body);
          const validatedParams = validators?.params?.parse(req.params);

          const validatedRequest = {
            ...req,
            query: validatedQuery,
            body: validatedBody,
            params: {
              ...req.params,
              ...validatedParams,
            },
          } as any;

          cb(validatedRequest, res);
        } catch (error) {
          res.status(400);

          const errors =
            error instanceof ZodError
              ? error.errors
              : error instanceof Error
              ? [{ message: error.message }]
              : [{ message: `${error}` }];

          res.json({ errors });
        }
      });
    };

    (application[method] as any) = typeSafeMethod;
  }

  return application as TypeSafeApplication<Application>;
};
