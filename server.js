
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      app: "MANSOUR VIDEO DOWNLOADER",
      status: "online",
      message: "Backend is working"
    }));
  }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      success: true,
      message: "API connected successfully"
    }));
  }

  if (req.method === "POST" && req.url === "/api/check-link") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10000) req.destroy();
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const url = new URL(data.url);

        const allowed = [
          "facebook.com",
          "www.facebook.com",
          "m.facebook.com",
          "fb.watch"
        ];

        if (!allowed.includes(url.hostname)) {
          res.writeHead(400);
          return res.end(JSON.stringify({
            success: false,
            message: "Invalid Facebook link"
          }));
        }

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: "Link accepted for authorized access",
          url: url.toString()
        }));

      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: "Please enter a valid link"
        }));
      }
    });

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: "Route not found"
  }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("MANSOUR API running on port " + PORT);
});
