const fs = require('fs');

let fileContent = fs.readFileSync('server.ts', 'utf8');

const targetBrides = `"/brides": {
        title: "Kirthi Brides | Kirthi Diamonds",
        desc: "Celebrating the brides who wear our custom engagement rings and bridal masterpieces.",`;

const newBrides = `"/brides": {
        title: "Kirthi Brides | Kirthi Diamonds",
        desc: "Bespoke bridal jewellery in Kochi and Calicut, crafted with certified natural diamonds, BIS hallmarked gold, and Kirthi’s written lifetime buyback and exchange promise.",`;

fileContent = fileContent.replace(targetBrides, newBrides);
fs.writeFileSync('server.ts', fileContent);

