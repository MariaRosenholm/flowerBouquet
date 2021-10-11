"use strict";

const http = require("http");
const flowers = require("./flowers.json");
const port = 3007;
const host = "localhost";

const server = http.createServer((request, response) => {
  response.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  response.end(JSON.stringify(flowers));
});

server.listen(port, host, () =>
  console.log(`Server ${host}: ${port} is listening`)
);
