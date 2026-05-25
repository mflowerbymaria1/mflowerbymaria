const fs = require('fs');
const path = require('path');

function replaceImage() {
    const src = "C:\\Users\\Leandro\\.gemini\\antigravity\\brain\\0afc3e0d-9578-4f83-8b21-763e810c9cb8\\media__1779752597729.jpg";
    const dest = path.join(process.cwd(), "public", "images", "mockup_yendo_back.jpg");
    
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log("Image swapped successfully!");
    } else {
        console.error("Source image not found!");
    }
}
replaceImage();
