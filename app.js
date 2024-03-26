"use strict";

import express from "express";
import profileRoute from "./routes/profile.js";
import { EntityNotFoundError, GenericError } from "./services/exception.js";

const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs
app.set("view engine", "ejs");

app.use(express.json());

// routes
app.use("/", profileRoute);

// error handler
const errorMapper = new Map([
  [
    EntityNotFoundError,
    {
      code: "ENTITY_NOT_FOUND_ERROR",
      status: 404,
    },
  ],
  [
    GenericError,
    {
      code: "GENERIC_ERROR",
      status: 422,
    },
  ],
]);
app.use((err, req, res, next) => {
  const errorInfo = errorMapper.get(err.constructor);

  if (errorInfo) {
    res.status(errorInfo.status).json({
      message: err.message,
      code: errorInfo.code,
    });
  } else {
    console.trace("INTERNAL_SERVER_ERROR");
    res.status(500).json({
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// start server
const server = app.listen(port, () => {
  console.log("Express started. Listening on %s", port);
});
