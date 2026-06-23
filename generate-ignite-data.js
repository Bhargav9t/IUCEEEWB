const fs = require('fs').promises;
const path = require('path');

const DIR_1 = path.join(
  __dirname,
  'public',
  'images',
  'SnakeTimelineNodes',
  'Ignite',
  '2. Ignite'
);

const DIR_2 = path.join(
  __dirname,
  'public',
  'images',
  'SnakeTimelineNodes',
  'Ignite',
  '2. Ignite',
  'ignite 2026'
);

const OUTPUT_FILE = path.join(
  __dirname,
  'src',
  'data',
  'ignite-media.json'
);

async function generateData() {
  try {
    const items = [];
    let idCounter = 1;

    // Helper function to scan a directory
    async function scanDirectory(dirPath, relativePrefix) {
      try {
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const file of files) {
          if (file.isFile()) {
            const ext = path.extname(file.name).toLowerCase();
            const src = `${relativePrefix}/${file.name}`;
            
            let type = '';
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
              type = 'image';
            } else if (['.mp4', '.mov'].includes(ext)) {
              type = 'video';
            }

            if (type) {
              // Assign a dynamic bento-box span based on item index
              const index = idCounter;
              let span = 'md:col-span-1 md:row-span-1';
              
              if (index % 11 === 0) {
                span = 'md:col-span-2 md:row-span-2';
              } else if (index % 11 === 3) {
                span = 'md:col-span-1 md:row-span-2';
              } else if (index % 11 === 6) {
                span = 'md:col-span-2 md:row-span-1';
              }

              items.push({
                id: `ignite-auto-${idCounter++}`,
                type,
                src,
                span,
                title: `Ignite Event Highlight ${idCounter - 1}`,
                description: `Captured moment from the Ignite event.`
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Directory not found or could not be read: ${dirPath}`);
      }
    }

    // Scan both directories (Ignite 2026 first to put photos first, or both in sequence)
    await scanDirectory(DIR_2, '/images/SnakeTimelineNodes/Ignite/2. Ignite/ignite 2026');
    await scanDirectory(DIR_1, '/images/SnakeTimelineNodes/Ignite/2. Ignite');

    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    
    // Write JSON file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(items, null, 2));
    console.log(`Successfully generated ${items.length} media items in ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating Ignite media data:', error);
  }
}

generateData();
