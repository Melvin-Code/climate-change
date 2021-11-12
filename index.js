const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspaper = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/environment/",
    base: "https://www.telegraph.co.uk",
  },
];

const articles = [];

app.get("/", (req, res) => {
  res.json("Welcome to my climite Change News Api");
});

// get with dinamic id

const getData = (add, name, base) => {
  axios.get(add).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("climate")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        title,
        url: base + url,
        source: name,
      });
    });
  });
};
// map trough nespaper and use the function getData to get the data
newspaper.map((item) => {
  getData(item.address, item.name, item.base);
});

app.get("/news", (req, res) => {
  res.json(articles);
});

//create get request using nespaper.[name]
app.get("/news/:name", (req, res) => {
  const name = req.params.name;
  const filtered = articles.filter((item) => item.source === name);
  res.json(filtered);
});

//run server on port 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
