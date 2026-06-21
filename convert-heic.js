const fs = require('fs').promises;
const path = require('path');
const heicConvert = require('heic-convert');

const SOURCE_DIR = path.join(
  __dirname,
  'public',
  'images',
  'SnakeTimelineNodes',
  'IASFaddressalevent',
  '5. IASF ADDRESSAL EVENT-20260621T144558Z-3-001',
  '5. IASF ADDRESSAL EVENT'
);

const TARGET_DIR = path.join(
  __dirname,
  'public',
  'images',
  'events',
  'iasf-gallery'
);

async function convertHeicToJpg() {
  try {
    // Ensure target directory exists
    await fs.mkdir(TARGET_DIR, { recursive: true });
    
    // Read source directory
    const files = await fs.readdir(SOURCE_DIR);
    console.log(`Found ${files.length} total files in the source directory.`);

    let convertedCount = 0;
    let copiedCount = 0;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const filePath = path.join(SOURCE_DIR, file);
      
      if (ext === '.heic') {
        const baseName = path.basename(file, ext);
        const outputFilePath = path.join(TARGET_DIR, `${baseName}.jpg`);
        
        console.log(`Converting ${file} -> ${baseName}.jpg...`);
        try {
          const inputBuffer = await fs.readFile(filePath);
          const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 0.85
          });
          
          await fs.writeFile(outputFilePath, outputBuffer);
          console.log(`Successfully converted ${file}`);
          convertedCount++;
        } catch (err) {
          console.error(`Failed to convert ${file}:`, err);
        }
      } else if (ext === '.jpg' || ext === '.jpeg') {
        const outputFilePath = path.join(TARGET_DIR, file);
        console.log(`Copying existing image ${file}...`);
        try {
          await fs.copyFile(filePath, outputFilePath);
          copiedCount++;
        } catch (err) {
          console.error(`Failed to copy ${file}:`, err);
        }
      } else {
        console.log(`Skipping non-image/video file: ${file}`);
      }
    }

    console.log(`\nConversion complete!`);
    console.log(`Converted HEIC files: ${convertedCount}`);
    console.log(`Copied JPG/JPEG files: ${copiedCount}`);
  } catch (error) {
    console.error('Error during HEIC conversion:', error);
  }
}

convertHeicToJpg();
