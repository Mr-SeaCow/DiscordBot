const http = require("https");

const options = {
  "method": "GET",
  "hostname": "api.tracker.gg",
  "port": null,
  "path": "/api/v2/rocket-league/standard/profile/steam/76561198346756402",
  "headers": {
    "cookie": "X-Mapping-Server=s7; __cf_bm=.saBHdZ3XCa.rBOH8pGwTHCTUxCH4sj.Rfw3tiiC6pI-1654557435-0-AVbszOtqSdvibt6nrTwIZCD%2F2qwtqi5Zbxwf7T%2BQyuK9aLmAlU6VWv210iYp3rGUs%2B3QkWLxkd6WhUZfhcVT5eA%3D; __cflb=02DiuFQAkRrzD1P1mdkJhfdTc9AmTWwYkTTXKkkqDtPqN",
    "User-Agent": "insomnia/2022.3.0",
    "Content-Length": "0"
  }
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();