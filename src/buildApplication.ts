import { Validator } from "./validator";

type ValidationSchema<Query = unknown, Body = unknown, Params = unknown> = {
  query: Validator<Query>;
  body: Validator<Body>;
  params: Validator<Params>;
};

type RequestHandlerValidators = Partial<ValidationSchema>;

type ExpressApplication<Request = unknown, Response = unknown> = {
  request: Request;
  response: Response;
  get: (
    route: string,
    cb: (req: Request, res: Response) => Promise<void> | void,
  ) => undefined;
};

type RequestHandler<Application extends ExpressApplication> = (
  req: Application["request"],
  res: Application["response"],
) => Promise<void> | void;

type TypeSafeApplication<Application extends ExpressApplication> =
  Application & {
    get: (
      route: string,
      cb: RequestHandler<Application>,
      validators?: RequestHandlerValidators,
    ) => void;
  };

export const buildApplication = <Application extends ExpressApplication>(
  express: () => Application,
): TypeSafeApplication<Application> => {
  const application = express();
  const originalGet = application.get.bind(application);
  const typeSafeApplication = application as TypeSafeApplication<Application>;

  typeSafeApplication.get = ((route, cb, validators) => {
    originalGet(route, async (req: any, res: any) => {
      try {
        const validatedQuery = await validators?.query?.parseAsync(req.query);
        const validatedBody = await validators?.body?.parseAsync(req.body);
        const validatedParams = await validators?.params?.parseAsync(
          req.params,
        );

        cb(
          {
            ...req,
            query: validatedQuery ?? undefined,
            body: validatedBody ?? undefined,
            params: validatedParams ?? undefined,
          },
          res,
        );
      } catch (error) {
        return res.status(400).json({ error: true });
      }
    });
  }) as (typeof typeSafeApplication)["get"];

  return typeSafeApplication;
};
