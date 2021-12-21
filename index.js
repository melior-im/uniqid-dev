require("dotenv").config();
const app = require("./express");

const port = process.env.PORT;

app.listen(port, () => {
  console.log("info", `Server started on port ${port}`);
});

module.exports = app;
