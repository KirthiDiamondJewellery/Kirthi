const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetStr = `
            if (post) {
              newHtml = newHtml.replace(
`;

const replaceStr = `
            if (!post) {
              throw new Error('404_NOT_FOUND');
            }

            if (post) {
              newHtml = newHtml.replace(
`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('server.ts', code);
