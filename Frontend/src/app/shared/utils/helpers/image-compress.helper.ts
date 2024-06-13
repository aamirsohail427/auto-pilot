export class ImageCompressHelper {
    public compress(options: any): Promise<any> {
        return new Promise((resolve) => {
            const imageElement = new Image();
            imageElement.src = options.imageSrc;
            imageElement.onload = function () {
                let w = imageElement.width,
                    h = imageElement.height;
                const scale = w / h;
                if (w > 1000 && options.width) {
                    options.width = 1000;
                }
                if (w > options.width) {
                    w = options.width || w;
                    h = options.height || (w / scale);
                }
                const canvasElement = document.createElement('canvas');
                const ctx = canvasElement.getContext('2d');
                const anw = document.createAttribute('width');
                anw.nodeValue = w.toString();
                const anh = document.createAttribute('height');
                anh.nodeValue = h.toString();
                canvasElement.setAttributeNode(anw);
                canvasElement.setAttributeNode(anh);
                ctx.drawImage(imageElement, 0, 0, w, h);
                resolve(canvasElement.toDataURL(options.type, options.quality));
            };

            imageElement.onerror = function () {
                imageElement.parentNode.removeChild(imageElement);
            };

            imageElement.src = options.imageSrc;
        });
    }
}
