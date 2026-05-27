const Jimp = require('jimp');
const path = require('path');

async function fixImage() {
    const imgPath = path.join(process.cwd(), 'public', 'images', 'mockup_yendo_back.jpg');
    const img = await Jimp.read(imgPath);
    
    const width = img.bitmap.width;
    const height = img.bitmap.height;
    
    // The Gemini logo is usually at the bottom right.
    // Let's sample a color slightly above and left of the logo.
    const sampleColor = img.getPixelColor(width - 150, height - 150);
    
    // Draw a rectangle over the bottom right corner (approx 120x60 pixels for the logo)
    const blockWidth = 140;
    const blockHeight = 80;
    const block = new Jimp(blockWidth, blockHeight, sampleColor);
    
    img.composite(block, width - blockWidth, height - blockHeight);
    
    await img.writeAsync(imgPath);
    console.log("Watermark covered successfully!");
}

fixImage().catch(console.error);
