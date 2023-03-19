const express = require("express");
const dbConnnect = require("./db");

const app = express();
const port = 5000;
const host = "http://localhost";
dbConnnect();

app.use(express.json({ limit: "5mb", extended: true }));
app.use(
  express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50000 })
);
app.use(express.json());
app.use((req, res, next) => {
  let origin = req.headers.origin;
  // console.log("origin ", origin);
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-headers",
    "Origin, X-Requested-With,Content-Type,auth-token,Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use("/auth", require("./router/auth"));
app.use("/blog", require("./router/blog"));
app.use("/user", require("./router/userData"));
app.listen(port, () => {
  console.log(`server Start at port ${host}:${port}`);
});
