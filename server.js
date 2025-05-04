const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const buildDir = path.join(__dirname, 'build');

app.use(express.static(buildDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});