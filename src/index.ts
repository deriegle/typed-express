import express from "express";
import { z } from "zod";
import { buildApplication } from "./buildApplication";

const app = buildApplication(express);

app.use(express.json());

app.get(
  "/hello",
  (req, res) => {
    const { name } = req.query;
    res.send(`Hello ${name}.`);
  },
  {
    query: z.object({
      name: z
        .union([z.literal("Devin"), z.literal("world")])
        .optional()
        .default("world"),
    }),
  },
);

app.post(
  "/test",
  (req, res) => {
    const { age } = req.body;
    res.send(
      `<html><head><title>AGE CALCULATOR</title></head><body><h1>You are ${age} years old.</h1></body></html>`,
    );
  },
  {
    body: z.object({
      age: z.number().int(),
    }),
  },
);

app.listen(3000, () => console.log("Listening on port 3000"));
