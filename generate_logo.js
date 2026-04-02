const fs = require('fs');
const path = require('path');

const svgData = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="8" fill="url(#brand-gradient)"/>
<path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="3" stroke-linecap="round"/>
<defs>
<linearGradient id="brand-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
<stop stop-color="#3B82F6"/>
<stop offset="1" stop-color="#8B5CF6"/>
</linearGradient>
</defs>
</svg>`;

const imagesDir = path.join(__dirname, '..', 'images');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

fs.writeFileSync(path.join(imagesDir, 'logo.svg'), svgData);