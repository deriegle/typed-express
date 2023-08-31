import { ExpressApplication } from "./express";
import { ValidatorsSchema } from "./validator";

type TypesafeRequest<
  Application extends ExpressApplication,
  Query,
  Body,
  Params,
> = Omit<Application["request"], "body" | "params" | "query"> & {
  body: Body;
  params: Params;
  query: Query;
};

type RequestHandler<
  Application extends ExpressApplication,
  Query,
  Body,
  Params,
> = (
  req: TypesafeRequest<Application, Query, Body, Params>,
  res: Application["response"],
) => Promise<void> | void;

export type TypesafeHandler<Application extends ExpressApplication> = <
  Route extends string,
  Query,
  Body,
  Params,
>(
  route: Route,
  cb: RequestHandler<Application, Query, Body, Params>,
  validators?: ValidatorsSchema<Query, Body, Params>,
) => void;
