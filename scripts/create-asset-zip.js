/* eslint-disable */
const JSZip = require('jszip');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const directories = ['public/static/items', 'public/static/powers', 'public/static/icons', 'public/static/heroes'];
const outputZip = 'public/static/assets.zip';

async function optimizeAndZipImages() {
  const zip = new JSZip();

  try {
    for (const dir of directories) {
      try {
        await fs.access(dir);
        console.log(`Directory exists: ${dir}`);
      } catch (e) {
        console.error(`Directory not found: ${dir}`);
        continue;
      }

      const absolutePath = path.resolve(dir);
      console.log(`Searching in: ${absolutePath}`);

      const files = glob.sync('**/*.{png,jpg,jpeg}', {
        cwd: absolutePath,
        absolute: true
      });

      console.log(`Found ${files.length} images in ${dir}:`);
      files.forEach(file => console.log(` - ${file}`));

      for (const file of files) {
        const filename = path.basename(file);

        const imageBuffer = await sharp(file)
          .webp({ quality: 70, compressionLevel: 9 })
          .resize(68, 68, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toBuffer();

        zip.file(filename, imageBuffer);
        console.log(`Added ${filename}`);
      }
    }

    const outputDir = path.dirname(outputZip);
    await fs.mkdir(outputDir, { recursive: true });

    console.log('Creating zip file...');
    const zipContent = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });

    await fs.writeFile(outputZip, zipContent);

    console.log(`\nSuccess! Asset zip created at ${outputZip}`);
    console.log(`Total size: ${(zipContent.length / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('Error creating asset zip:', error);
    process.exit(1);
  }
}

optimizeAndZipImages();