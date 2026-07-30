const fs = require('fs');
let s = fs.readFileSync('Dockerfile', 'utf8');

// Ensure node:22-alpine
s = s.replace(/FROM node:[^\s]+ AS builder/, 'FROM node:22-alpine AS builder');
s = s.replace(/FROM node:[^\s]+ AS runner/, 'FROM node:22-alpine AS runner');

fs.writeFileSync('Dockerfile', s);
