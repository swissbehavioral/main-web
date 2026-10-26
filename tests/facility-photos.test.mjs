import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {officePhotos,lodgingPhotos} from '../app/data/facility-photos.ts';
test('Office and lodging galleries reference real, separate WebP assets with captions',async()=>{
 const all=[...officePhotos,...lodgingPhotos];
 assert.equal(new Set(all.map(p=>p.src)).size,all.length);
 for(const [photos,folder] of [[officePhotos,'office'],[lodgingPhotos,'lodging']])for(const photo of photos){
  assert(photo.src.startsWith(`/images/${folder}/`));assert(!/\s/.test(photo.src));assert(photo.caption.length>0);assert(photo.width>0 && photo.height>0);
  const bytes=await readFile(new URL('../public'+photo.src,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 }
 assert(officePhotos.some(photo=>photo.src==='/images/office/office-building-exterior.webp'));
});
