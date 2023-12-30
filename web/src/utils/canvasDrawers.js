export const convertSvgToString = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const svgFileContent = await response.text();

    // const base64Encoded = btoa(svgFileContent);
    return svgFileContent;
  } catch (error) {
    console.error("Error converting SVG to string:", error);
    throw error;
  }
};

const createBlobUrl = (data) => {
  return URL.createObjectURL(new Blob([data], { type: "image/svg+xml" }));
};

export const drawSvg = (data) => {
  const canvasDirect = document.getElementById("canvas");
  const ctx = canvasDirect.getContext("2d");
  const url = createBlobUrl(data);

  const img1 = new Image();
  img1.src = url;
  img1.onload = () => {
    ctx.drawImage(img1, 0, 0, 150, 150);
    URL.revokeObjectURL(url);
  };
};
