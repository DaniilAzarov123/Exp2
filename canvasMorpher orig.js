
// canvasMorpher.js
function createAndManipulateCanvases(originalCanvas) {
    const body = document.body;
    // Create two new canvas elements
    const newCanvas = document.createElement('canvas');

    // Set dimensions for the new canvases
    newCanvas.width = originalCanvas.width/2;
    newCanvas.height = originalCanvas.height;

    // Get contexts
    const ctx = newCanvas.getContext('2d');


    let container = document.getElementById('canvasContainer');
    if (!container) {
        // Create a new container if it does not exist
        container = document.createElement('div');
        container.id = 'canvasContainer';
        document.body.appendChild(container); // Append the container to the body or any other suitable element

        // Optionally set styles directly via JavaScript
        container.style.width = '100%'; // Adjust as necessary
        container.style.height = 'auto';
        container.style.display = 'none';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    }

    // Append new canvases to the document body (or any other container)
    container.appendChild(newCanvas);

    return newCanvas;
}

class CanvasMorpher {
  constructor(c, numPoints, radius) {
    //this.canvas = document.getElementById(canvasId);
    this.ctx = c.getContext('2d');
    this.canvas = this.ctx.canvas;
    this.numPoints = numPoints;
    this.radius = radius;
  }

  //Random Color generator
  /*generateRandomColor(){
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }*/
  generateRandomColor() {
    // Generate random colors that are not too light
    // Ensure each component is at least below 200 to avoid light colors
    const r = Math.floor(Math.random() * 156); // Red: 0-155
    const g = Math.floor(Math.random() * 156); // Green: 0-155
    const b = Math.floor(Math.random() * 156); // Blue: 0-155
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  generateRandomCircleCoordinates() {
    const coordinates = [];

    for (let i = 0; i < this.numPoints; i++) {
      const angle = (Math.PI * 2 * i) / this.numPoints;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      coordinates.push({ x, y });
    }

    return coordinates;
  }

  nonlinearAsymmetricPerspectiveShift(x, y, p) {
    const scaleFactorX = 1 + p * Math.pow(x / 110, 3);
    const scaleFactorY = 1 + 0.2 * Math.pow(y / 110, 2);

    const newX = x * Math.pow(scaleFactorX, 2);
    const newY = y * Math.pow(scaleFactorY, 1.5);

    return { x: newX, y: newY };
  }

  morphAndDraw(p) {
    const originalCoordinates = this.generateRandomCircleCoordinates();
    const morphedCoordinates = originalCoordinates.map(({ x, y }) => this.nonlinearAsymmetricPerspectiveShift(x, y, p));

    const minX = Math.min(...morphedCoordinates.map(coord => coord.x));
    const minY = Math.min(...morphedCoordinates.map(coord => coord.y));
    const maxX = Math.max(...morphedCoordinates.map(coord => coord.x));
    const maxY = Math.max(...morphedCoordinates.map(coord => coord.y));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const normalizedCoordinates = morphedCoordinates.map(({ x, y }) => ({
      x: x - minX + this.canvas.width / 2,
      y: y - minY + this.canvas.height / 2
    }));

    const backgroundColor = this.generateRandomColor();
    while (backgroundColor == '#FFFFFF'){
      backgroundColor = this.generateRandomColor();
    }
    //const originalColor = this.generateRandomColor();
    const originalColor = '#FFFFFF';
    //const morphedColor = this.generateRandomColor();
    const morphedColor = '#FFFFFF';

    this.ctx.fillStyle = backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCircle(originalCoordinates, originalColor, 1.5);
    this.drawCircle(normalizedCoordinates, morphedColor, 1.5);
  }

  drawCircle(coordinates, color, scaleFactor) {
    this.ctx.beginPath();

    this.ctx.moveTo(coordinates[0].x, coordinates[0].y);

    for (let i = 1; i < coordinates.length; i++) {
      const x = coordinates[i].x;
      const y = coordinates[i].y;
      this.ctx.lineTo(x, y);
    }

    this.ctx.closePath();

    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  canvasToImage() {
    const img = new Image();
    img.src = this.canvas.toDataURL();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return img;
  }

  getImages(canvas, img1, img2, x1, y1, x2, y2) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(img1, x1, y1);
    ctx.drawImage(img2, x2, y2);
  }

  combineImages(canvas, p1, p2) {
    const ctx = canvas.getContext('2d');
    const newCanvas = createAndManipulateCanvases(canvas);
    const container = document.getElementById('canvasContainer');
    const canvasMorpher = new CanvasMorpher(newCanvas, 80, 138);
    canvasMorpher.morphAndDraw(p1);
    const img1 = canvasMorpher.canvasToImage();
    canvasMorpher.morphAndDraw(p2);
    const img2 = canvasMorpher.canvasToImage();
    img1.onload = () => {
            img2.onload = () => {
                  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                  ctx.drawImage(img1, 0, 0);
                  ctx.drawImage(img2, 500, 0);
            };
    };

  }
}


// Usage example:
// const canvasMorpher = new CanvasMorpher('myCanvas', 100, 105);
// canvasMorpher.morphAndDraw();
// Usage example:
// const canvas = document.getElementById('myCanvas');
// const canvasMorpher = new CanvasMorpher(canvas, 100, 105);
// canvasMorpher.morphAndDraw(0.5);
