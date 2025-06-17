
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


  morphAndDraw(p) {
    function distort (blob,ctrl,angle,distance) //angle is in radians.  Straight up = pi/2
    {
      ctrl_x_first[blob][ctrl]= ctrl_x_first[blob][ctrl]+ Math.cos(angle)*distance;
      ctrl_y_first[blob][ctrl]= ctrl_y_first[blob][ctrl]+Math.sin(angle)*distance;
      return;
    }

    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }
        return temp;
    }

    var intrablob_distance=500;
  	var num_ctrls=4;
  	var offset=1.7;
  	var blob_offset=70;
  	var dots_offset=450;
    var c2=0;
    var m=0;
    var b=0;
    var horizontal_rec_y=0; //safest to declare each variable separate so that they're not equal to the same object
    var horizontal_rec_x=0;
    var vertical_rec_x=0;
    var vertical_rec_y=0;
    var x_points = [[],[],[],[],[]]; //two dimensional array.  Note: [[]] syntax did NOT work well for me.  4 [] because we have four blobs
  	var y_points= [[],[],[],[],[]];
  	var ctrl_x_first= [[],[],[],[],[]]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
  	var ctrl_y_first=[[],[],[],[],[]];
  	var ctrl_x_second=[[],[],[],[],[]];
  	var ctrl_y_second=[[],[],[],[],[]];
    x_points[0]= [100,220,310,210];
    y_points[0]= [190,140,250,320];
    x_points[1] = cloneObject(x_points[0]);
    y_points[1]= cloneObject(y_points[0]);
    x_points[2] = cloneObject(x_points[0]);
    y_points[2]= cloneObject(y_points[0]);
    x_points[3] = cloneObject(x_points[0]);
    y_points[3]= cloneObject(y_points[0]);
    x_points[4] = cloneObject(x_points[0]);
    y_points[4]= cloneObject(y_points[0]);
    // Setting up the control points for the Bezier curve
    ctrl_x_first= [142, 255, 362, 137]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
  	ctrl_y_first=[58, 239, 479, 286];
      var distortion_amount=50;
      ctrl_x_first[0]= [142, 255, 362, 137]; //these are the first control points.  The second control points are  versions of the successive first points flipped around the actual point coord
      ctrl_y_first[0]=[58, 239, 479, 286];

      ctrl_x_first[1]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[1]=cloneObject(ctrl_y_first[0]);;

      ctrl_x_first[2]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[2]=cloneObject(ctrl_y_first[0]);;

      ctrl_x_first[3]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[3]=cloneObject(ctrl_y_first[0]);;

      ctrl_x_first[4]= cloneObject(ctrl_x_first[0]); //before, I set ctrl_x_first[1] = ctrl_x_first[0] which was wrong because it just made them the same ACTUAL object, forever inseparable
      ctrl_y_first[4]=cloneObject(ctrl_y_first[0]);



      distort(1,0,3.14159/4,distortion_amount); //(which blob, which control point, angle of movement, amount of distortion)	.  pi/4 is 45 degrees
    	distort(2,0,(3.14159/2)+3.14159/4,distortion_amount); //blob 2's 0 coordinate if distorted 90 degrees from blob 1's distortion.  pi/2 = 90 degrees
    	distort(3,0,3.14159/4,distortion_amount); //blob 3 is distorted twice relative to blob 0 - sharing both 1's and 2's distortions
    	distort(3,0,(3.14159/2)+3.14159/4,distortion_amount);

    	distort(1,1,3.14159*3/4,distortion_amount); //3*pi/4 = 135 degrees
    	distort(2,1,(3.14159/2)+3.14159*3/4,distortion_amount); //blob 2's 0 coordinate if distorted 90 degrees from blob 1's distortion.  pi/2 = 90 degrees
    	distort(3,1,3.14159*3/4,distortion_amount); //blob 3 is distorted twice relative to blob 0 - sharing both 1's and 2's distortions
    	distort(3,1,(3.14159/2)+3.14159*3/4,distortion_amount);

    	distort(1,2,3.14159*5/4,distortion_amount); //5*pi/4 = 225 degrees
    	distort(2,2,(3.14159/2)+3.14159*5/4,distortion_amount); //blob 2's 0 coordinate if distorted 90 degrees from blob 1's distortion.  pi/2 = 90 degrees
    	distort(3,2,3.14159*5/4,distortion_amount); //blob 3 is distorted twice relative to blob 0 - sharing both 1's and 2's distortions
    	distort(3,2,(3.14159/2)+3.14159*5/4,distortion_amount);

    	distort(1,2,3.14159,distortion_amount); //pi = 180 degrees
    	distort(2,2,(3.14159/2)+3.14159,distortion_amount); //blob 2's 0 coordinate if distorted 90 degrees from blob 1's distortion.  pi/2 = 90 degrees
    	distort(3,2,3.14159,distortion_amount); //blob 3 is distorted twice relative to blob 0 - sharing both 1's and 2's distortions
    	distort(3,2,(3.14159/2)+3.14159,distortion_amount);



    function flipped	 (px,py,cx,cy)
  	{
  		var nx=(cx-px)+cx;
  		var ny=(cy-py)+cy;
  		return [nx,ny];
  	};


      var which=4;
    	var center_x=0;
    	var center_y=-50;
    	var c2=flipped(ctrl_x_first[which][1],ctrl_y_first[which][1],x_points[which][1],y_points[which][1]); //want the second control point to be the 180 flipped version of the subsequent first control point
    	ctrl_x_second[which][0]=c2[0]; //x coord
    	ctrl_y_second[which][0]=c2[1]; //y coord
    	 c2=flipped(ctrl_x_first[which][2],ctrl_y_first[which][2],x_points[which][2],y_points[which][2]);
    	ctrl_x_second[which][1]=c2[0];
    	ctrl_y_second[which][1]=c2[1];
    	 c2=flipped(ctrl_x_first[which][3],ctrl_y_first[which][3],x_points[which][3],y_points[which][3]);
    	ctrl_x_second[which][2]=c2[0];
    	ctrl_y_second[which][2]=c2[1];

    	 c2=flipped(ctrl_x_first[which][0],ctrl_y_first[which][0],x_points[which][0],y_points[which][0]);  //wraps around to first point
    	ctrl_x_second[which][3]=c2[0];
    	ctrl_y_second[which][3]=c2[1];

      var maxxy=700; //should be able to go as high as 1000 given the interactive morph program
      //In the example below, the stimuli are arranged in a single dimension of monotonic increase because the X and Y dimensions are perfectly correlated
      var e={x:maxxy*p,y:maxxy*p}; //how to set coordinates to show - used to be set by mouse

      //in the example below, the stimuli are arranged in a perfect circle as p varies 0 to 1
      var theta = p * 2 * Math.PI;
      var e={x:(maxxy/2)+Math.cos(theta)*(maxxy/2),y:(maxxy/2)+Math.sin(theta)*(maxxy/2)}; //as p ranges from 0 to 1, the morphs go around circle ending up exactly where they started


      //the stimuli are arranged in a diagonal sine wave as p goes from 0 to 1
      var e={x:p*maxxy,y:Math.sin(p*2*Math.PI)*(maxxy/2)};

      //the stimuli are arranged in a half circle as p goes from 0 to 1
      var theta = p  * Math.PI;
      var e={x:(maxxy/2)+Math.cos(theta)*(maxxy/2),y:(maxxy/2)+Math.sin(theta)*(maxxy/2)}; //as p ranges from 0 to 1, the morphs go around circle ending up exactly where they started

      //e={x:100,y:100};



      for (var j = 0; j < num_ctrls; j++) {
  			m=(ctrl_x_first[1][j]-ctrl_x_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
  			b=ctrl_x_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
  			horizontal_rec_x=(e.x-100)*offset*m+b;
  			m=(ctrl_y_first[1][j]-ctrl_y_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
  			b=ctrl_y_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
  			horizontal_rec_y=(e.x-100)*offset*m+b;

  			m=(ctrl_x_first[2][j]-ctrl_x_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
  			b=ctrl_x_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
  			vertical_rec_x=(e.y-100)*offset*m+b;
  			m=(ctrl_y_first[2][j]-ctrl_y_first[0][j])/intrablob_distance; //solve for the slope of the line relating screen distance to coordinate distance
  			b=ctrl_y_first[0][j]-m*intrablob_distance;  //solve for the intercept so we get the full equation for the line
  			vertical_rec_y=(e.y-100)*offset*m+b;

  			ctrl_x_first[4][j]=(horizontal_rec_x+vertical_rec_x)/2;
  			ctrl_y_first[4][j]=(horizontal_rec_y+vertical_rec_y)/2;
  		}


    	this.ctx.lineWidth = 6;
    	this.ctx.beginPath();
    	this.ctx.moveTo(x_points[which][0]+center_x, y_points[which][0]+center_y);
    	this.ctx.bezierCurveTo(ctrl_x_first[which][0]+center_x,ctrl_y_first[which][0]+center_y,ctrl_x_second[which][0]+center_x,ctrl_y_second[which][0]+center_y,x_points[which][1]+center_x,y_points[which][1]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[which][1]+center_x,ctrl_y_first[which][1]+center_y,ctrl_x_second[which][1]+center_x,ctrl_y_second[which][1]+center_y,x_points[which][2]+center_x,y_points[which][2]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[which][2]+center_x,ctrl_y_first[which][2]+center_y,ctrl_x_second[which][2]+center_x,ctrl_y_second[which][2]+center_y,x_points[which][3]+center_x,y_points[which][3]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
    	this.ctx.bezierCurveTo(ctrl_x_first[which][3]+center_x,ctrl_y_first[which][3]+center_y,ctrl_x_second[which][3]+center_x,ctrl_y_second[which][3]+center_y,x_points[which][0]+center_x,y_points[which][0]+center_y); //p1x and p1y are the first control point coords, p2x and p2y are the second, and p3x and p3y is the actual second point
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
    const canvasMorpher = new CanvasMorpher(newCanvas, 200, 200);
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
