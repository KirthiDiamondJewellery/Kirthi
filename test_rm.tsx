import React from 'react';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { weaveLinks } from './src/lib/linkWeaver';

const md = `**Get the buyback policy in writing on the invoice.**`;

const html = renderToString(
  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
    {weaveLinks(md, 'id')}
  </ReactMarkdown>
);
console.log(html);
