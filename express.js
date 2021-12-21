const express = require("express");
const ash = require("express-async-handler");
const { validate, ValidationError } = require("express-validation");
const httpStatus = require("http-status");
const Joi = require("joi");

const app = express();
const api = require("./api");

app.use(express.static("public"));

app.get("/status", (req, res, next) => {
  res.status(httpStatus.OK).json({ message: "OK" });
  return null;
});

// TODO: / (root) - return static home page

const getIdsSchema = {
  query: Joi.object({
    count: Joi.number().integer().min(1).max(999),
    prefix: Joi.string().max(100).optional(),
    suffix: Joi.string().max(100).optional(),
    mode: Joi.string().valid("default", "time", "process"),
  }),
};

app.get("/api", validate(getIdsSchema, { keyByField: false }), api.getIds);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  if (err.name === "UnauthorizedError") {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // TODO: remove
  console.error(err);

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
});

module.exports = app;
