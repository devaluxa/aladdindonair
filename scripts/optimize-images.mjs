import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(await readFile('docs/asset-manifest.json','utf8'));
for(const image of manifest){
 const lossless=/logo|icon/.test(image.local);
 const buffer=await sharp(image.original).resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:92,lossless,effort:6}).toBuffer();
 await writeFile('public'+image.local,buffer);
 const metadata=await sharp(buffer).metadata();
 image.width=metadata.width;image.height=metadata.height;image.optimizedBytes=buffer.length;
 image.sourceSha256=createHash('sha256').update(await readFile(image.original)).digest('hex');
 image.optimizedSha256=createHash('sha256').update(buffer).digest('hex');
 if(image.small)await sharp(buffer).resize({width:640,height:640,fit:'inside',withoutEnlargement:true}).webp({quality:90,effort:6}).toFile('public'+image.small);
 console.log(image.local);
}
await writeFile('docs/asset-manifest.json',JSON.stringify(manifest,null,2)+'\n');
