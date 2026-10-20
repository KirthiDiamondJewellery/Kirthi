const fs = require('fs');
const dataUrl = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';
fetch(dataUrl)
  .then(res => res.text())
  .then(text => console.log(text))
  .catch(err => console.error(err));
