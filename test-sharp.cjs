const sharp = require('sharp');
sharp({
  create: {
    width: 100,
    height: 100,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 1 }
  }
})
.webp()
.toBuffer({ resolveWithObject: true })
.then(result => {
  console.log(Object.keys(result));
  console.log(result.info);
});
