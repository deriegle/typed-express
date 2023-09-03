import { ExpressApplication } from "./express";
import { ValidatorsSchema } from "./validator";

type IsRouteParams<Param extends string> = Param extends `:${infer ParamName}`
  ? ParamName
  : never;

type ParamsFromRoute<Route extends string> =
  Route extends `${infer Path1}/${infer Path2}`
    ? IsRouteParams<Path1> | ParamsFromRoute<Path2>
    : IsRouteParams<Route>;

type TypesafeRequest<
  Application extends ExpressApplication,
  Route extends string,
  Query,
  Body,
  Params,
> = Omit<Application["request"], "body" | "params" | "query"> & {
  body: Body;
  params: {
    [Key in ParamsFromRoute<Route>]: Params extends { [k in Key]: infer Value }
      ? Value
      : string;
  };
  query: Query;
};

type RequestHandler<
  Application extends ExpressApplication,
  Route extends string,
  Query,
  Body,
  Params,
> = (
  req: TypesafeRequest<Application, Route, Query, Body, Params>,
  res: Application["response"],
) => Promise<void> | void;

export type TypesafeHandler<Application extends ExpressApplication> = <
  Route extends string,
  Query,
  Body,
  Params,
>(
  route: Route,
  cb: RequestHandler<Application, Route, Query, Body, Params>,
  validators?: ValidatorsSchema<Query, Body, Params>,
) => void;
