/**
 * js/services/exportService.js
 * Функционал скачивания диаграмм (Реальная конвертация)
 */

// Экспорт в SVG
export const downloadSVG = (svgElement, filename = 'diagram.svg') => {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    
    // Добавляем XML декларацию, если её нет
    if (!source.match(/^<\?xml/)) {
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }
    
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    
    triggerDownload(url, filename);
};

// Экспорт в PNG (Конвертация SVG -> Canvas -> PNG)
export const downloadPNG = (svgElement, filename = 'diagram.png') => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    // Получаем размеры SVG
    const svgSize = svgElement.getBoundingClientRect();
    // Увеличиваем разрешение в 2 раза для четкости (Retina)
    canvas.width = svgSize.width * 2;
    canvas.height = svgSize.height * 2;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
        ctx.fillStyle = "white"; // Белый фон вместо прозрачного
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgUrl = canvas.toDataURL("image/png");
        triggerDownload(imgUrl, filename);
    };
    
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
};

// Вспомогательная функция триггера скачивания
const triggerDownload = (url, filename) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};