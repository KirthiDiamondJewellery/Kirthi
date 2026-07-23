const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log("req.path is:", req.path);
  res.end();
});

const server = app.listen(3001, () => {
  const http = require('http');
  http.get('http://localhost:3001/faq', (res) => {
    process.exit(0);
  });
});
