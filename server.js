require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const URL = require("url");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const links = [];

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:id", (req, res) => {
  if (links[req.params.id]) {
    const domain = links[req.params.id].original_url;
    res.redirect(domain);
  } else {
    res.json({ msg: "No url at this route" });
  }
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  // Parse url
  const { protocol, slashes, hostname } = URL.parse(url);

  // Check if it matches requested format
  if (!protocol || !slashes || !hostname) {
    return res.json({ error: "invalid url" });
  }

  // dns:lookup() needs url without protocols. Hostname works.
  dns.lookup(hostname, (err, address, family) => {
    if (!address) {
      console.error(err);
      return res.json({ error: "invalid url" });
    }

    // Response object
    const urlEntry = {
      short_url: links.length,
      original_url: url,
    };

    links.push(urlEntry);

    res.json(urlEntry);
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
