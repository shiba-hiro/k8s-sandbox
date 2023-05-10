const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/healthcheck") {
    console.log("healthcheck endpoint is called");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  } else {
    console.log("other endpoint is called");
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 3770;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
