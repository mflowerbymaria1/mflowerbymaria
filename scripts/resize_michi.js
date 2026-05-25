const Jimp = require('jimp');
const path = require('path');

async function resizeMichi() {
    const srcPath = "C:\\Users\\Leandro\\.gemini\\antigravity\\brain\\0afc3e0d-9578-4f83-8b21-763e810c9cb8\\media__1779752597729.jpg";
    const destPath = path.join(process.cwd(), 'public', 'images', 'mockup_yendo_back.jpg');
    
    try {
        const michi = await Jimp.read(srcPath);
        
        // Target canvas size (matches front image exactly)
        const canvasW = 678;
        const canvasH = 909;
        
        // Create a solid white canvas
        const canvas = new Jimp(canvasW, canvasH, 0xFFFFFFFF); // White
        
        // We want the michi to have padding, so it looks "zoomed out"
        // Let's scale it to be 85% of the canvas width
        const targetW = Math.floor(canvasW * 0.85);
        michi.resize(targetW, Jimp.AUTO); // Auto calculates height to keep aspect ratio
        
        // Calculate center position
        const x = Math.floor((canvasW - michi.bitmap.width) / 2);
        const y = Math.floor((canvasH - michi.bitmap.height) / 2);
        
        // Paste the michi onto the white canvas
        canvas.composite(michi, x, y);
        
        // Save
        await canvas.writeAsync(destPath);
        console.log("Michi zoomed out and saved!");
    } catch(e) {
        console.error(e);
    }
}
resizeMichi();
