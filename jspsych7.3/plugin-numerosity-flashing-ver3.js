var jsPsychNumerosityEstimationFlashing = (function (jspsych){
    "use strict";

    const info = {
        name: "numerosity-estimation-flashing",
        parameters: {
            /** The image to be displayed */
            stimulus: {
                type: jspsych.ParameterType.IMAGE,
                pretty_name: "Stimulus",
                default: undefined,
                array: true,
            },
            // Appearance type (stationary or flashing)
            appearance: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Appearance",
                default: "stationary",
            },
            /** Set the image height in pixels */
            stimulus_height: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Image height",
                default: null,
            },
            random_seed: {
                type: jspsych.ParameterType.INT,
                pretty_name: "random number seed",
                default: null,
            },
            scaling: {
                type: jspsych.ParameterType.FLOAT,
                pretty_name: "Amount of scaling",
                default: 1,
            },
            /** Set the image width in pixels */
            stimulus_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Image width",
                default: null,
            },
            /** Maintain the aspect ratio after setting width or height */
            maintain_aspect_ratio: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Maintain aspect ratio",
                default: true,
            },
            /** Sets the minimum value of the slider. */
            min: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Min slider",
                default: 0,
            },
            /** Sets the maximum value of the slider */
            max: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Max slider",
                default: 100,
            },
            /** Sets the starting value of the slider */
            slider_start: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Slider starting value",
                default: 50,
            },
            callibration: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "callibration",
                default: "test",
            },
            /** Sets the step of the slider */
            step: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Step",
                default: 1,
            },
            /** Array containing the labels for the slider. Labels will be displayed at equidistant locations along the slider. */
            labels: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Labels",
                default: [],
                array: true,
            },
            /** Width of the slider in pixels. */
            slider_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Slider width",
                default: null,
            },
            /** Label of the button to advance. */
            button_label: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button label",
                default: "Continue",
                array: false,
            },
            /** If true, the participant will have to move the slider before continuing. */
            require_movement: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Require movement",
                default: false,
            },
            /** Any content here will be displayed below the slider. */
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
            },
            /** How long to show the trial. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: 1500,
            },
            image_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Image on-screen",
                default: 1500,
            },
            blank_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Blank screen duration within one trial",
                default: null,
            },
            sequence_reps: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Sequence repetitions",
                default: 1,
            },
            /** If true, trial will end when user makes a response. */
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
            choices: {
                type: jspsych.ParameterType.KEYS,
                pretty_name: "Choices",
                default: null,                          // maybe need to chnage here
            },
            /**
             * If true, the image will be drawn onto a canvas element 
             * (prevents blank screen between consecutive images in some browsers).
             * If false, the image will be shown via an img element.
             */
            render_on_canvas: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Render on canvas",
                default: true,
            },
        },
    };
    class ImageSliderResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            var Appearance = trial.appearance; // flashing or stationary
            var TrialDur = trial.trial_duration;
            var interval_time = TrialDur;
            var animate_frame = 0;
            var reps = 0;
            var startTime = performance.now();
            var animation_sequence = [];
            var responses = [];
            var current_stim = "";
            if (Appearance=== "flashing"){
                var ImageDur = trial.image_duration;
                var BlankDur = trial.blank_duration;
            }else{
                var ImageDur = TrialDur;
            }
            var height, width;
            var html;
            // half of the thumb width value from jspsych.css, 
            // used to adjust the label positions
            var half_thumb_width = 7.5;

            if (trial.render_on_canvas) {
                // first clear the display element (because the render_on_canvas method appends to display_element instead of overwriting it with .innerHTML)
                if (display_element.hasChildNodes()) {
                    // can't loop through child list because the list will be modified by .removeChild()
                    while (display_element.firstChild) {
                        display_element.removeChild(display_element.firstChild);
                    }
                }
                var canvas = document.createElement("canvas");
                canvas.id = "jspsych-image-slider-response-stimulus"; // "jspsych-animation-image";
                canvas.style.margin = "0";
                canvas.style.padding = "0";
                // display_element.insertBefore(canvas, null);
                var content_wrapper = document.createElement("div");
                content_wrapper.id = "jspsych-image-slider-response-wrapper";
                content_wrapper.style.margin = "100px 0px";
                var ctx = canvas.getContext("2d");
                
                var image_drawn = false;
                var spriteSize = 70;
                
                var map;
                // need to keep this list unchanged because it indicates the order of stimuli in the directory (NOT the order it will be presented)
                var sprite_list = [ "animalCrackers", "letters", "butterflies", "hearts",
                                    "crackers", "bears", "fruits", "jellyBeans", "marbles", 
                                    "mints", "rocks", "buttons"];
                
                // if we have gone through all the cycles
                //if (cycle >= num_cycles) return;

                var sprites = trial.stimulus;
                var img = new Image();
                // get the sprite index in the list
                var sprite_ind_in_list = [];
                var shownImages = [];
                for (let i = 0; i < sprites.length; i++){
                    sprite_ind_in_list.append(sprite_list.findIndex(a => a == sprites[i]));
                    var current_pic = 'assets/sheet' + (sprite_ind_in_list[i] + 1) + '.png';
                    shownImages.append(current_pic);
                }
                

                console.log("Sprite:", sprites);
                console.log("Sprite Index in List:", sprite_ind_in_list);
                console.log("Shown Image:", shownImages);

                
                // what to do when the image is loaded:
                img.onload = () => {
                    // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
                    if (!image_drawn) {
                        switch (shownImages[animate_frame]) {

                            // animalCrackers
                            case "assets/sheet1.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0]);
                            break;

                            // letters
                            case "assets/sheet2.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0],
                                    [0,1],[1,1],[2,1],[3,1],[4,1],
                                    [0,2],[1,2],[2,2],[3,2],[4,2],
                                    [0,3],[1,3],[2,3],[3,3],[4,3],
                                    [0,4],[1,4],[2,4],[3,4],[4,4],
                                    [0,5]);//coordinates of each image in X and Y.
                            break;

                            // butterflies
                            case "assets/sheet3.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0]);
                            break;

                            // hearts
                            case "assets/sheet4.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0]);
                            break;

                            // crackers
                            case "assets/sheet5.png":
                                map = Array([0,0],[1,0]);
                            break;

                            // bears
                            case "assets/sheet6.png":
                                map = Array([0,0],[1,0],[2,0],[3,0]);
                            break;

                            // fruits
                            case "assets/sheet7.png":
                                map = Array([0,0],[1,0],[2,0],[3,0]);
                            break;

                            // jellyBeans
                            case "assets/sheet8.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0],
                                    [0,1],[1,1],[2,1],[3,1],[4,1],
                                    [0,2],[1,2],[2,2],[3,2],[4,2],
                                    [0,3],[1,3],[2,3],[3,3],[4,3]);
                            break;

                            // marbles
                            case "assets/sheet9.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]);
                            break;

                            // mints
                            case "assets/sheet10.png":
                                map = Array([0,0],[1,0],[2,0],[3,0]);
                            break;

                            // rocks
                            case "assets/sheet11.png":
                                map = Array([0,0],[1,0],[2,0],[3,0]);
                            break;

                            // buttons
                            case "assets/sheet12.png":
                                map = Array([0,0],[1,0],[2,0],[3,0],[4,0],
                                        [0,1],[1,1],[2,1],[3,1],[4,1],
                                        [0,2],[1,2],[2,2],[3,2],[4,2]);
                            break;
                        };

                        console.log("Map:", map);
                        // trial.sprites.push(sprites); // save either one or many stimuli
                        getHeightWidth(); // only possible to get width/height after image loads
                        let positions = [];

                        // draw images in random locations
                        for (let i = 0; i < trial.numerosity; i++) {
                            let placed = false;
                            console.log("placed:", placed);
                            const rng = new SeedableRNG(trial.random_seed); // Initialize with a seed
                            
                            console.log("rng:", rng);
                            while (!placed) {

                                let sprite_i = Math.floor(rng.random() * map.length);
                                let x_loc = Math.floor(rng.random() * (trial.stimulus_width - spriteSize));
                                let y_loc = Math.floor(rng.random() * (trial.stimulus_height - spriteSize));
                                console.log("sprite_i:", sprite_i);

                                // Check for overlap with previously placed objects
                                let overlap = positions.some(pos => {
                                    return x_loc < pos.x + spriteSize*trial.scaling &&
                                            x_loc + spriteSize*trial.scaling > pos.x &&
                                            y_loc < pos.y + spriteSize*trial.scaling &&
                                            y_loc + spriteSize*trial.scaling > pos.y;
                                });
                                console.log("overlap:", overlap);

                                if (!overlap) {
                                    // Calculate the center of where the image will be drawn
                                    const centerX = x_loc + (spriteSize * trial.scaling) / 2;
                                    const centerY = y_loc + (spriteSize * trial.scaling) / 2;
                                    // Generate a random rotation angle in radians
                                    // For example, to rotate between 0 and 360 degrees, convert degrees to radians
                                    const rotationAngle = rng.random() * 2 * Math.PI; // 2*PI radians is 360 degrees
                                    ctx.save(); // Save the current context state (step 1)
                                    // Move the context to the center of where the image will be drawn (step 2)
                                    ctx.translate(centerX, centerY); // change the (0,0) point to (centerX, centerY)
                                    // Rotate the context (step 3)
                                    ctx.rotate(rotationAngle);
                                    // Draw the image, adjusting the position so the rotation occurs around the center (step 4)
                                    ctx.drawImage(img,                                                      // image source
                                        map[sprite_i][0] * spriteSize, map[sprite_i][1] * spriteSize,           // x, y coordinates of the image we want to crop (crop a butterfly from the butterflies sheet)
                                        spriteSize, spriteSize,                                             // width, height of the cropped image
                                        -spriteSize * trial.scaling / 2, -spriteSize * trial.scaling / 2,   // x,y coordinates on the screen related to (centerX, centerY)
                                        spriteSize * trial.scaling, spriteSize * trial.scaling);            // width, height of the image on the screen
                                    ctx.restore(); // Restore the original context state (step 5)

                                    // No overlap, draw the object and store its position
                                            //args: source
                                    //x coordinate in image to start clipping
                                    //y coordinate
                                    //width of clipped image
                                    //height of clipped image
                                    //X location of where to send it
                                    //Y location
                                    positions.push({x: x_loc, y: y_loc});
                                    console.log("positions:", positions);
                                    placed = true;
                                    console.log("placed:", placed);
                                }
                            }
                        }
                    }
                } // after img.onload
                
            }
        }
    }
})(jsPsychModule);