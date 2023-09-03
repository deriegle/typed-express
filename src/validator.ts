export type Validator<Schema> = {
  parse: (data: unknown) => Schema;
};

export type ValidatorsSchema<Query, Body, Params> = Partial<{
  query?: Validator<Query>;
  params?: Validator<Params>;
  body?: Validator<Body>;
}>;
