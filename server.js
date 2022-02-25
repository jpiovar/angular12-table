const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');

app = express();
app.use(serveStatic(path.join(__dirname, 'dist/frontend')));
// For virtual routes use
app.use('*', (req, res) =>
{
  res.sendFile(__dirname +'/dist/frontend/index.html');
 });
const port = process.env.PORT || 8080;
app.listen(port);
