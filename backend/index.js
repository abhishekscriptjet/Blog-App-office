const express = require("express");
const dbConnnect = require("./db");
const ApiVideoClient = require("@api.video/nodejs-client");

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
// app.use("/api", require("./router/uploadTokens"));

const http = require("http");

app.use(async (req, res) => {
  // console.log(req.url);
  if (req.url === "/api/uploadTokens") {
    try {
      const client = new ApiVideoClient({
        apiKey: process.env.API_KEY,
      });
      if (req.method === "GET") {
        const uploadTokensList = await client.uploadTokens.list();
        // console.log("GET");
        res.status(200).json({ uploadTokensList });
      } else if (req.method === "POST") {
        const newUploadToken = await client.uploadTokens.createToken();
        // console.log("POST");
        res.status(200).json({ newUploadToken });
      } else res.status(405).send("METHOD NOT ALLOWED");
    } catch (error) {
      res.status(401).send(error);
    }
  }
});

//   if (req.method !== "GET") {
//     res.end(`{"error": "${http.STATUS_CODES[405]}"}`);
//   } else {
//     if (req.url === "/") {
//       res.end(`<h1>Hello World</h1>`);
//     }
//     if (req.url === "/hello") {
//       res.end(`<h1>Hello</h1>`);
//     }
//   }
//   res.end(`{"error": "${http.STATUS_CODES[404]}"}`);
// });

app.listen(port, () => {
  console.log(`server Start at port ${host}:${port}`);
});
