type Validator<Schema> = {
  parseAsync: (data: unknown) => Promise<Schema>;
};

export type ValidatorsSchema<
  Query = unknown,
  Body = unknown,
  Params = unknown,
> = Partial<{
  query: Validator<Query>;
  body: Validator<Body>;
  params: Validator<Params>;
}>;
