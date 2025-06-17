
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

    // Setting up the control points for the Bezier curve
    const x_points = [100,220,310,210];  // Add the starting point at the end to close the shape smoothly
    const y_points = [190,140,250,320];  // Same as above
    const ctrl_x_first= [142, 255, 362, 137]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
  	const ctrl_y_first=[58, 239, 479, 286];
    const originalColor = '#0000FF';  // This will be the color of the blob

    function flipped	 (px,py,cx,cy)
  	{
  		var nx=(cx-px)+cx;
  		var ny=(cy-py)+cy;
  		return [nx,ny];
  	};

    	var center_x=0;
    	var center_y=0;
      var ctrl_x_second=[];
      var ctrl_y_second=[];
    	var c2=flipped(ctrl_x_first[1],ctrl_y_first[1],x_points[1],y_points[1]); //want the second control point to be the 180 flipped version of the subsequent first control point
    	ctrl_x_second[0]=c2[0]; //x coord
    	ctrl_y_second[0]=c2[1]; //y coord
    	 c2=flipped(ctrl_x_first[2],ctrl_y_first[2],x_points[2],y_points[2]);
    	ctrl_x_second[1]=c2[0];
    	ctrl_y_second[1]=c2[1];
    	 c2=flipped(ctrl_x_first[3],ctrl_y_first[3],x_points[3],y_points[3]);
    	ctrl_x_second[2]=c2[0];
    	ctrl_y_second[2]=c2[1];

    	 c2=flipped(ctrl_x_first[0],ctrl_y_first[0],x_points[0],y_points[0]);  //wraps around to first point
    	ctrl_x_second[3]=c2[0];
    	ctrl_y_second[3]=c2[1];
    	this.ctx.lineWidth = 6;
    	this.ctx.beginPath();

    	this.ctx.moveTo(x_points[0]+center_x, y_points[0]+center_y);
    	this.ctx.bezierCurveTo(ctrl_x_first[0]+center_x,ctrl_y_first[0]+center_y,ctrl_x_second[0]+center_x,ctrl_y_second[0]+center_y,x_points[1]+center_x,y_points[1]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[1]+center_x,ctrl_y_first[1]+center_y,ctrl_x_second[1]+center_x,ctrl_y_second[1]+center_y,x_points[2]+center_x,y_points[2]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[2]+center_x,ctrl_y_first[2]+center_y,ctrl_x_second[2]+center_x,ctrl_y_second[2]+center_y,x_points[3]+center_x,y_points[3]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[3]+center_x,ctrl_y_first[3]+center_y,ctrl_x_second[3]+center_x,ctrl_y_second[3]+center_y,x_points[0]+center_x,y_points[0]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
      this.ctx.fillStyle = "red";
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
