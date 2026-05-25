const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'images', 'repuestos_svg');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Colors
const COLOR_BLANCO = "#ffffff";
const COLOR_NATURAL = "#fdf5e6"; // Cream/ivory
const COLOR_LINES = "#d0d0d0"; // Soft gray for lines/grids A4/A5
const COLOR_FICHAS_BLUE = "#8db4e2"; // Light blue for fichas
const COLOR_FICHAS_RED = "#e06666"; // Red for fichas top line
const COLOR_BG_BLANCO = "#fce8ec"; // Pastel pink
const COLOR_BG_NATURAL = "#e8fcf0"; // Pastel green

const config = {
    a4: {
        width: 300, height: 424,
        holes: 11,
        holeMarginRatio: 0.072, 
        name: "A4"
    },
    a5: {
        width: 300, height: 424, 
        holes: 8,
        holeMarginRatio: 0.076, 
        name: "A5"
    },
    fichas: {
        width: 380, height: 228,
        holes: 5,
        holeMarginRatio: 0.15,
        name: "Fichas N3"
    }
};

function generateSVG(sizeKey, paperType, patternType) {
    const s = config[sizeKey];
    const paperColor = paperType === 'Blanco' ? COLOR_BLANCO : COLOR_NATURAL;
    const bgColor = paperType === 'Blanco' ? COLOR_BG_BLANCO : COLOR_BG_NATURAL;
    
    const xBase = (500 - s.width) / 2;
    const yEdge = (500 - s.height) / 2;
    
    // Exact hole calculations
    const holeMarginPx = s.height * s.holeMarginRatio;
    const firstHoleY = yEdge + holeMarginPx;
    const lastHoleY = yEdge + s.height - holeMarginPx;
    
    let holesHTML = "";
    const holeSpacing = s.holes > 1 ? (lastHoleY - firstHoleY) / (s.holes - 1) : 0;
    
    for(let i=0; i<s.holes; i++) {
        const cy = firstHoleY + (i * holeSpacing);
        holesHTML += `
            <circle cx="${xBase + 10}" cy="${cy}" r="7" fill="black" />
            <rect x="${xBase - 5}" y="${cy - 4}" width="15" height="8" fill="black" />
        `;
    }

    // Pattern Calculations for A4/A5
    const holeRadius = 7;
    const marginT = firstHoleY - holeRadius; 
    const marginB = lastHoleY + holeRadius;  
    const marginL = xBase + 35;              
    const distToTopEdge = marginT - yEdge;
    const marginR = xBase + s.width - distToTopEdge; 
    
    const contentW = marginR - marginL;
    const contentH = marginB - marginT;
    
    let patternHTML = "";
    
    if (sizeKey === 'fichas') {
        if (patternType === 'Rayadas') {
            let lines = "";
            const lineSpacing = 13; // Much denser lines for index cards!
            const topMargin = yEdge + 35; // Header margin
            
            const fichasMarginL = xBase;
            const fichasMarginR = xBase + s.width;
            
            lines += `<line x1="${fichasMarginL}" y1="${topMargin}" x2="${fichasMarginR}" y2="${topMargin}" stroke="${COLOR_FICHAS_RED}" stroke-width="1.5" />\n`;
            
            for (let y = topMargin + lineSpacing; y < yEdge + s.height - 10; y += lineSpacing) {
                lines += `<line x1="${fichasMarginL}" y1="${y}" x2="${fichasMarginR}" y2="${y}" stroke="${COLOR_FICHAS_BLUE}" stroke-width="1.2" />\n`;
            }
            patternHTML = lines;
        }
    } else {
        // A4 and A5
        if (patternType === 'Rayadas') {
            let lines = "";
            const lineSpacing = 16; // Denser lines for regular paper
            const startY = marginT + lineSpacing;
            for (let y = startY; y <= marginB - 5; y += lineSpacing) {
                lines += `<line x1="${marginL}" y1="${y}" x2="${marginR}" y2="${y}" stroke="${COLOR_LINES}" stroke-width="1.5" />\n`;
            }
            patternHTML = lines;
        } else if (patternType === 'Cuadriculadas') {
            patternHTML = `
                <defs>
                    <pattern id="grid_${sizeKey}_${paperType}" width="12" height="12" patternUnits="userSpaceOnUse" x="${marginL}" y="${marginT}">
                        <path d="M 12 0 L 0 0 0 12" fill="none" stroke="${COLOR_LINES}" stroke-width="1.2"/>
                        <path d="M 0 12 L 12 12" fill="none" stroke="${COLOR_LINES}" stroke-width="1.2"/>
                    </pattern>
                </defs>
                <rect x="${marginL}" y="${marginT}" width="${contentW}" height="${contentH}" fill="url(#grid_${sizeKey}_${paperType})" />
            `;
        } else if (patternType === 'Punteadas') {
            patternHTML = `
                <defs>
                    <pattern id="dots_${sizeKey}_${paperType}" width="14" height="14" patternUnits="userSpaceOnUse" x="${marginL}" y="${marginT}">
                        <circle cx="7" cy="7" r="1.5" fill="${COLOR_LINES}" />
                    </pattern>
                </defs>
                <rect x="${marginL}" y="${marginT}" width="${contentW}" height="${contentH}" fill="url(#dots_${sizeKey}_${paperType})" />
            `;
        }
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="5" stdDeviation="8" flood-opacity="0.1"/>
    </filter>
    <mask id="paper-mask">
      <rect x="${xBase}" y="${yEdge}" width="${s.width}" height="${s.height}" fill="white" rx="3" ry="3" />
      ${holesHTML}
    </mask>
  </defs>

  <rect width="500" height="500" fill="${bgColor}" />
  
  <g filter="url(#shadow)">
      <rect x="${xBase + 4}" y="${yEdge + 4}" width="${s.width}" height="${s.height}" fill="${paperColor}" mask="url(#paper-mask)" opacity="0.4" />
      <rect x="${xBase + 2}" y="${yEdge + 2}" width="${s.width}" height="${s.height}" fill="${paperColor}" mask="url(#paper-mask)" opacity="0.7" />
      <rect x="${xBase}" y="${yEdge}" width="${s.width}" height="${s.height}" fill="${paperColor}" mask="url(#paper-mask)" />
  </g>
  
  <g mask="url(#paper-mask)">
      ${patternHTML}
  </g>
</svg>`;

    const filename = `${sizeKey}_${paperType.toLowerCase()}_${patternType.toLowerCase()}.svg`;
    fs.writeFileSync(path.join(outputDir, filename), svg);
    console.log(`Generated ${filename}`);
}

const paperTypes = ['Blanco', 'Natural'];
const patternTypes = ['Rayadas', 'Lisas', 'Cuadriculadas', 'Punteadas'];

for (const paper of paperTypes) {
    for (const pattern of patternTypes) {
        generateSVG('a4', paper, pattern);
        generateSVG('a5', paper, pattern);
    }
}

generateSVG('fichas', 'Blanco', 'Rayadas');
generateSVG('fichas', 'Natural', 'Rayadas');
