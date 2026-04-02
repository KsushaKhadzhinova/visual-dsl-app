export const downloadSVG = (svgElement, filename = 'diagram.svg') => {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    
    if (!source.match(/^<\?xml/)) {
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }
    
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    triggerDownload(url, filename);
};

export const downloadPNG = (svgElement, filename = 'diagram.png') => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgSize = svgElement.getBoundingClientRect();
    
    canvas.width = svgSize.width * 2;
    canvas.height = svgSize.height * 2;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgUrl = canvas.toDataURL("image/png");
        triggerDownload(imgUrl, filename);
    };
    
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
};

const triggerDownload = (url, filename) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};