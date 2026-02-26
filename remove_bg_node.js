const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const dir = '/Users/yudeyou/Desktop/tai-402/public/images/agents';

async function processImages() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

    for (const file of files) {
        const filePath = path.join(dir, file);
        try {
            const image = await Jimp.read(filePath);
            const width = image.bitmap.width;
            const height = image.bitmap.height;

            console.log(`Processing: ${file}`);

            // Sweep color space
            image.scan(0, 0, width, height, function (x, y, idx) {

                const red = this.bitmap.data[idx + 0];
                const green = this.bitmap.data[idx + 1];
                const blue = this.bitmap.data[idx + 2];
                const alpha = this.bitmap.data[idx + 3];

                // Is it close to white? Often AI generates #fefefe etc.
                if (red > 235 && green > 235 && blue > 235) {
                    // Check if it's on edge or connected to edge (Heuristic: just nuke near-white for now)
                    // Given the dark themed robots, wiping all near white is usually safe
                    this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
                }
            });

            await image.writeAsync(filePath);
            console.log(`Finished: ${file}`);
        } catch (err) {
            console.error(`Error with ${file}`, err);
        }
    }
}

processImages();
