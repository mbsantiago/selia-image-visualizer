const fs = require('fs');
const express = require('express')
const path = require('path');
const app = express()
const port = 3000


function filterUnwantedFiles(filename) {
  if (filename.includes('DS_Store')) return false;

  return true;
}


app.get('/', function (req, res) {
  var files = fs.readdirSync(path.join(__dirname, 'public', 'files'))
    .filter((filename) => filterUnwantedFiles(filename))
  res.sendFile(path.join(__dirname, 'public', 'files', files[0]));
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
