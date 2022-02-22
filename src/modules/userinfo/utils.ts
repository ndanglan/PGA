const canvasToBlob = (canvas: any): any => {
  return new Promise(function (resolve) {
    canvas.toBlob(
      (blob: any) => {
        // const previewUrl = window.URL.createObjectURL(blob);
        resolve(blob)
      },
      'image/jpeg',
      1
    );
  })
}

export async function generateUrlBlob(canvas: any, crop: any) {
  if (!crop || !canvas) {
    return;
  }

  const blob: Blob = await canvasToBlob(canvas);

  const file = new File([blob], "avatar.jpeg", { type: "image.jpeg" })

  return file
}
