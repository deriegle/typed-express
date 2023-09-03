import { z } from "zod";
import { ValidatorsSchema } from "./validator";

type IsRouteParams<Param extends string> = Param extends `:${infer ParamName}`
  ? ParamName
  : never;

type ParamsFromRoute<Route extends string> =
  Route extends `${infer Path1}/${infer Path2}`
    ? IsRouteParams<Path1> | ParamsFromRoute<Path2>
    : IsRouteParams<Route>;

type RequestFromRoute<Route extends string, Params> = {
  params: {
    [Key in ParamsFromRoute<Route>]: Params extends { [k in Key]: infer Value }
      ? Value
      : string;
  };
};

type RouteHandler<Route extends string, Params> = (
  req: RequestFromRoute<Route, Params>,
) => void;

type RouteDefiner = <Route extends string, Params>(
  route: Route,
  handler: RouteHandler<Route, Params>,
  definitions?: ValidatorsSchema<Params>,
) => void;

const get: RouteDefiner = (route, handler, schema) => undefined;

get("hello/:name/age/:age", ({ params }) => {
  params.name;
  params.age;
});

// TODO: work with leading slash
// get("/hello/:name", ({ params }) => {
//   params;
//   const name = params.name;
//   console.log(params);
// });
