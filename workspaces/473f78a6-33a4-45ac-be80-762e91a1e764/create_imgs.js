const fs = require('fs');

const bgPxPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAANSURBVBhXY3jP4PgfAAWgA4EEM1nEAAAAAElFTkSuQmCC";

fs.writeFileSync('public/logo.png', Buffer.from(bgPxPng, 'base64'));
fs.writeFileSync('public/og-cover.jpg', Buffer.from(bgPxPng, 'base64'));
fs.writeFileSync('public/favicon.ico', Buffer.from(bgPxPng, 'base64'));

console.log('Images generated in public/');
