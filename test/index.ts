import express from "express";
import { z } from "zod";
import { buildApplication } from "../src/index";

const app = buildApplication(express);

app.use(express.json());

app.get(
  "/hello",
  (req, res) => {
    const { age, name } = req.query;

    const message = `Hello ${name}.<br />You are ${age} years old.`;

    res.send(`
      <html>
	  <head>
	    <title>AGE</title>
	  </head>
	  <body>
	    <h1>${message}</h1>
	  </body>
      </html>
    `);
  },
  {
    query: z.object({
      age: z.coerce.number().int(),
      name: z.string(),
    }),
  },
);

app.post(
  "/test",
  (req, res) => {
    const { age, name } = req.body;
    const message = `Hello ${name ?? "world"}. You are ${age} years old.`;

    res.send(`
      <html>
	  <head>
	    <title>AGE</title>
	  </head>
	  <body>
	    <h1>${message}</h1>
	  </body>
      </html>
    `);
  },
  {
    body: z.object({
      age: z.number().int(),
      name: z.string().optional(),
    }),
  },
);

app.listen(3000, () => console.log("Listening on port 3000"));
