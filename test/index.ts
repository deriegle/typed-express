import express from "express";
import { z } from "zod";
import { buildApplication } from "../src/index";
import { faker } from "@faker-js/faker";
import { liveReloadRouter } from "./live-reload";

const app = buildApplication(express);

app.use(express.json());
app.use(liveReloadRouter);

app.get(
  "/hello/:name/age/:age",
  (req, res) => {
    res.send(`
<html>
<body>
<h1>Hello ${req.params.name} 👋,
You are ${req.params.age} years old.</h1>
</body>
</html>
    `);
  },
  {
    params: z.object({
      age: z.coerce.number().gt(12),
    }),
  },
);

app.get(
  "/hello",
  (req, res) => {
    const { age, name } = req.query;

    const message = `Welcome ${name ?? faker.person.fullName()},<br />You are ${
      age ??
      faker.number.int({
        min: 1,
        max: 114,
      })
    } years old.`;

    res.send(`
      <html>
	  <head>
	    <title>AGE</title>
	    <script type="text/javascript" src="http://localhost:3000/live.js"></script>
	  </head>
	  <body>
	    <h1>${message}</h1>
	  </body>
      </html>
    `);
  },
  {
    query: z.object({
      age: z.coerce.number().int().positive().optional(),
      name: z.string().optional(),
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
