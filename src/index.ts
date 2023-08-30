import express from "express";
import { z } from "zod";
import { buildApplication } from "./buildApplication";

const app = buildApplication(express);

app.get(
  "/test",
  (req, res) => {
    const name = req.query.name;
    res.send(`Hello ${name}`);
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

app.get("/hello", (req, res) => {
  const { name = "world" } = req.query as any;
  res.send(`<html><body><h1>Hello ${name}</h1></body></html>`);
});

app.listen(3000, () => console.log("Listening on port 3000"));
