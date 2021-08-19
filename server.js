require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
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

    // Looks like redirects need a protocol

    res.redirect(`https://${domain}`);
  } else {
    res.json({ msg: "No url at this route" });
  }
});

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  // dns.lookup throws an error with any urls with protocols or slashes. Remove both with replace

  const REMOVE_PROTOCOL = /^https?:\/\//i;

  const noProtocolUrl = url.replace(REMOVE_PROTOCOL, "");
  const baseDomain = noProtocolUrl.replace("/", "");

  dns.lookup(baseDomain, (err, address, family) => {
    if (!address) {
      console.error(err);
      return res.json({ error: "invalid url" });
    }

    const urlEntry = {
      short_url: links.length,
      original_url: baseDomain,
    };

    // Pushing baseDomain for easier protocol add

    links.push(urlEntry);

    res.json({ original_url: url, short_url: urlEntry.short_url });
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
