import fs from 'fs';

const path = './src/data/products.js';
let content = fs.readFileSync(path, 'utf8');

// Find the start of Repuestos (id: 15)
const startIdx = content.indexOf('{', content.indexOf('id: 15'));
if (startIdx !== -1) {
    // Find the end of the array
    const endIdx = content.lastIndexOf(']');
    if (endIdx !== -1) {
        const newRepuestos = `    {
        id: 15,
        name: "Repuesto Hojas A4",
        category: "repuestos",
        shortDescription: "Repuesto A4, 100 hojas, papel de alta calidad.",
        description: "Repuesto para cuaderno A4 sistema de discos. Contiene 100 hojas en papel ecológico de 80 gr. Elegí el tipo de hoja y papel que prefieras.",
        price: "16.000",
        image: "/images/repuestos_svg/a4_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/a4_blanco_rayadas.svg", "/images/repuestos_svg/a4_natural_rayadas.svg"]
    },
    {
        id: 16,
        name: "Repuesto Hojas A5",
        category: "repuestos",
        shortDescription: "Repuesto A5, 100 hojas, papel de alta calidad.",
        description: "Repuesto para cuaderno A5 sistema de discos. Contiene 100 hojas en papel ecológico de 90 gr. Elegí el tipo de hoja y papel que prefieras.",
        price: "13.500",
        image: "/images/repuestos_svg/a5_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/a5_blanco_rayadas.svg", "/images/repuestos_svg/a5_natural_rayadas.svg"]
    },
    {
        id: 17,
        name: "Repuesto Fichas N° 3",
        category: "repuestos",
        shortDescription: "100 fichas rayadas para fichero N° 3.",
        description: "Repuesto de fichero N° 3, contiene 100 fichas rayadas en papel de 120 gr. Elegí el tipo de papel que prefieras.",
        price: "10.900",
        image: "/images/repuestos_svg/fichas_blanco_rayadas.svg",
        images: ["/images/repuestos_svg/fichas_blanco_rayadas.svg", "/images/repuestos_svg/fichas_natural_rayadas.svg"]
    }
`;
        content = content.substring(0, startIdx) + newRepuestos + content.substring(endIdx);
        fs.writeFileSync(path, content, 'utf8');
        console.log("Updated products.js");
    }
}
