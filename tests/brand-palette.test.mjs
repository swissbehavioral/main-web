import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const logo=readFileSync('public/logos/SBH_Logo_Horizontal_Color.svg','utf8');
const allowed=new Set([...logo.matchAll(/#[0-9a-f]{6}/gi)].map(match=>match[0].slice(1).toLowerCase()));allowed.add('ffffff');
function files(directory){return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):[path.join(directory,entry.name)]);}
test('Authored website and dashboard colors come only from the official logo plus white',()=>{
 const failures=[];
 for(const file of [...files('app').filter(file=>/\.(css|tsx|ts)$/.test(file)), ...files('public').filter(file=>file.endsWith('.svg'))]){
  const source=readFileSync(file,'utf8');
  for(const match of source.matchAll(/#[0-9a-f]{8}\b|#[0-9a-f]{6}\b|#[0-9a-f]{4}\b|#[0-9a-f]{3}\b/gi)){
   let hex=match[0].slice(1).toLowerCase();if(hex.length<=4)hex=[...hex].map(c=>c+c).join('');
   if(!allowed.has(hex.slice(0,6)))failures.push(`${file}: ${match[0]}`);
  }
  for(const match of source.matchAll(/rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/g)){
   const hex=match.slice(1,4).map(value=>Number(value).toString(16).padStart(2,'0')).join('');
   if(!allowed.has(hex))failures.push(`${file}: ${match[0]}`);
  }
  if(/(?:bg|text|border|from|to|via|ring|outline|shadow|fill|stroke|accent|decoration)-(?:red|orange|amber|yellow|lime|green|emerald|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d/.test(source))failures.push(`${file}: non-brand Tailwind palette`);
 }
 assert.deepEqual(failures,[],failures.join('\n'));
});
