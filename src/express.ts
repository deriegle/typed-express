import type { Express, IRouterMatcher } from "express";

export type ExpressApplication<
  Request = Express["request"],
  Response = Express["response"],
> = {
  request: Request;
  response: Response;
  get: IRouterMatcher<any>;
  post: IRouterMatcher<any>;
  patch: IRouterMatcher<any>;
  put: IRouterMatcher<any>;
  delete: IRouterMatcher<any>;
};
