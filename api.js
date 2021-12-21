const httpStatus = require("http-status");
const uniqid = require("uniqid");

function getIds(req, res, next) {
  let count = 1;
  let prefix = null;
  let suffix = null;
  let mode = "default";
  let contentType = "text/plain";

  // set the params from request
  if (req.query.count) {
    count = req.query.count;
  }

  if (req.query.prefix) {
    prefix = req.query.prefix;
  }

  if (req.query.suffix) {
    suffix = req.query.suffix;
  }

  if (req.query.mode) {
    mode = req.query.mode;
  }

  if (req.accepts("text/plain")) {
    contentType = "text/plain";
  } else if (req.accepts("text/csv")) {
    contentType = "text/csv";
  } else if (req.accepts("application/json")) {
    contentType = "application/json";
  }

  const ids = generateIds(count, prefix, suffix, mode);

  const formatted = formatResult(ids, contentType);

  res.status(httpStatus.OK);
  res.set("Content-Type", contentType);
  res.send(formatted);
}

function formatResult(ids, contentType) {
  let output;
  if (contentType === "text/plain") {
    output = "";
    ids.forEach((id) => {
      if (output.length > 0) {
        output += "\n"; // newline separator
      }
      output += id;
    });
  } else if (contentType === "text/csv") {
    output = "";
    ids.forEach((id) => {
      if (output.length > 0) {
        output += ","; // comma separator
      }
      output += id;
    });
  } else if (contentType === "application/json") {
    output = JSON.stringify(ids);
  }

  return output;
}

function generateIds(count, prefix, suffix, mode) {
  fn = uniqid;
  if (mode === "time") {
    fn = uniqid.time;
  } else if (mode === "process") {
    fn = uniqid.process;
  }

  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(fn(prefix, suffix));
  }

  return ids;
}

module.exports = { getIds };
