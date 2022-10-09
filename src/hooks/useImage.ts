export function rotateBase64Img(src: string, edg: number, callback: (arg0: string) => void) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let imgW; //图片宽度
  let imgH; //图片高度
  let size; //canvas初始大小
  if (edg % 90 != 0) {
    console.error('旋转角度必须是90的倍数!');
    throw '旋转角度必须是90的倍数!';
  }
  edg < 0 && (edg = (edg % 360) + 360);
  const quadrant = (edg / 90) % 4; //旋转象限
  const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; //裁剪坐标
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = src;
  image.onload = function () {
    imgW = image.width;
    imgH = image.height;
    size = imgW > imgH ? imgW : imgH;
    canvas.width = size * 2;
    canvas.height = size * 2;
    switch (quadrant) {
      case 0:
        cutCoor.sx = size;
        cutCoor.sy = size;
        cutCoor.ex = size + imgW;
        cutCoor.ey = size + imgH;
        break;
      case 1:
        cutCoor.sx = size - imgH;
        cutCoor.sy = size;
        cutCoor.ex = size;
        cutCoor.ey = size + imgW;
        break;
      case 2:
        cutCoor.sx = size - imgW;
        cutCoor.sy = size - imgH;
        cutCoor.ex = size;
        cutCoor.ey = size;
        break;
      case 3:
        cutCoor.sx = size;
        cutCoor.sy = size - imgW;
        cutCoor.ex = size + imgH;
        cutCoor.ey = size + imgW;
        break;
    }
    ctx?.translate(size, size);
    ctx?.rotate((edg * Math.PI) / 180);
    ctx?.drawImage(image, 0, 0);
    const imgData = ctx?.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey) as ImageData;
    if (quadrant % 2 == 0) {
      canvas.width = imgW;
      canvas.height = imgH;
    } else {
      canvas.width = imgH;
      canvas.height = imgW;
    }
    ctx?.putImageData(imgData, 0, 0);
    callback(canvas.toDataURL());
  };
}
