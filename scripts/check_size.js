const Jimp = require('jimp');
const path = require('path');

async function checkSize() {
    const frontPath = path.join(process.cwd(), 'public', 'images', 'mockup_yendo_front.jpg');
    const backPath = path.join(process.cwd(), 'public', 'images', 'mockup_yendo_back.jpg');
    
    try {
        const front = await Jimp.read(frontPath);
        console.log(`Front image: ${front.bitmap.width}x${front.bitmap.height}`);
        
        const back = await Jimp.read(backPath);
        console.log(`Back image (michi): ${back.bitmap.width}x${back.bitmap.height}`);
    } catch(e) {
        console.error(e);
    }
}
checkSize();
