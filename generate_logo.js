const fileSystemModule = require("fs");
const pathUtilityModule = require("path");

const stringContainingSvgLogoSourceCode = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="32" height="32" rx="8" fill="url(#gradient_brand)"/>
<path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="3" stroke-linecap="round"/>
<defs><linearGradient id="gradient_brand" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
<stop stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs></svg>`;

const absolutePathToImagesDirectory = pathUtilityModule.join(__dirname, "images");

function executeLogoFileGenerationProcess() {
    if (!fileSystemModule.existsSync(absolutePathToImagesDirectory)) {
        fileSystemModule.mkdirSync(absolutePathToImagesDirectory);
    }
    fileSystemModule.writeFileSync(pathUtilityModule.join(absolutePathToImagesDirectory, "logo.svg"), stringContainingSvgLogoSourceCode);
    console.log("SVG Logo successfully generated on Disk E.");
}

executeLogoFileGenerationProcess();