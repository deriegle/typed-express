export type Validator<Schema> = {
  parseAsync: (data: unknown) => Promise<Schema>;
};
