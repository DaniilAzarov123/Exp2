var jsPsychNumerosityEstimationFlashing = (function (jspsych) {
    'use strict';
  
    const info = {
        name: "numerosity-estimation-flashing",
        parameters: {
            /** The image to be displayed */
            stimulus: {
                type: jspsych.ParameterType.IMAGE,
                pretty_name: "Stimulus",
                default: undefined,
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
            /** How long to show the stimulus. */
            stimulus_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: 1500,
            },
            blank_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Stimulus duration",
                default: null,
            },
            /** How long the trial lasts. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            /** If true, trial will end when user makes a response. */
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
            },
            /**
             * If true, the image will be drawn onto a canvas element (prevents blank screen between consecutive images in some browsers).
             * If false, the image will be shown via an img element.
             */
            render_on_canvas: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Render on canvas",
                default: true,
            },
        },
    };
    /**
     * **image-slider-response**
     *
     * jsPsych plugin for showing an image stimulus and getting a slider response
     *
     * @author Josh de Leeuw
     * @see {@link https://www.jspsych.org/plugins/jspsych-image-slider-response/ image-slider-response plugin documentation on jspsych.org}
     */
  
  
    class ImageSliderResponsePlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }
        trial(display_element, trial) {
            var Appearance = trial.appearance; // flashing or stationary
            var TrialDur = trial.trial_duration;
            var animate_frame = 0;

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
                // create wrapper div, canvas element and image
                var content_wrapper = document.createElement("div");
                content_wrapper.id = "jspsych-image-slider-response-wrapper";
                content_wrapper.style.margin = "100px 0px";
                var canvas = document.createElement("canvas");
                canvas.id = "jspsych-image-slider-response-stimulus";
                canvas.style.margin = "0";
                canvas.style.padding = "0";
                var ctx = canvas.getContext("2d");
                var map;
                var spriteSize;
                var sprites;
                // need to keep this list unchanged because it indicates the order of stimuli in the directory (NOT the order it will be presented)
                const sprite_list = [ "animalCrackers", "letters", "butterflies", "hearts",
                    "crackers", "bears", "fruits", "jellyBeans", "marbles", "mints",
                    "rocks", "buttons"];

                var show_images = (image_to_show) => {
                    var image_drawn = false;
                    var img = new Image();
                    var sprite_ind_in_list = sprite_list.findIndex(a => a == image_to_show);
                    var shownImage='assets/sheet'+((sprite_ind_in_list % 12)+1)+'.png';
                    console.log("shownImage:",shownImage);
                    img.onload = () => {
                        // if image wasn't preloaded, then it will need to be drawn whenever it finishes loading
                        if (!image_drawn) {
                            switch (shownImage) {

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
                            trial.sprites=image_to_show; // record the data
                            getHeightWidth(); // only possible to get width/height after image loads
                            let positions = [];
    
                            for (let i = 0; i < trial.numerosity; i++) {
                                let placed = false;
                                const rng = new SeedableRNG(trial.random_seed); // Initialize with a seed
                                while (!placed) {
                                    let sprite = Math.floor(rng.random() * map.length);
                                    let x_loc = Math.floor(rng.random() * (trial.stimulus_width - spriteSize));
                                    let y_loc = Math.floor(rng.random() * (trial.stimulus_height - spriteSize));
    
                                    // Check for overlap with previously placed objects
                                    let overlap = positions.some(pos => {
                                        return x_loc < pos.x + spriteSize*trial.scaling &&
                                            x_loc + spriteSize*trial.scaling > pos.x &&
                                            y_loc < pos.y + spriteSize*trial.scaling &&
                                            y_loc + spriteSize*trial.scaling > pos.y;
                                    });
    
                                    if (!overlap) {
                                    // Calculate the center of where the image will be drawn
                                    const centerX = x_loc + (spriteSize * trial.scaling) / 2;
                                    const centerY = y_loc + (spriteSize * trial.scaling) / 2;
                                    // Generate a random rotation angle in radians
                                    // For example, to rotate between 0 and 360 degrees, convert degrees to radians
                                    const rotationAngle = rng.random() * 2 * Math.PI; // 2*PI radians is 360 degrees
                                    ctx.save(); // Save the current context state (step 1)
                                    // Move the context to the center of where the image will be drawn (step 2)
                                    ctx.translate(centerX, centerY);
                                    // Rotate the context (step 3)
                                    ctx.rotate(rotationAngle);
                                    // Draw the image, adjusting the position so the rotation occurs around the center (step 4)
                                    ctx.drawImage(img, 
                                        map[sprite][0] * spriteSize, 
                                        map[sprite][1] * spriteSize,
                                        spriteSize, spriteSize,
                                        -spriteSize * trial.scaling / 2, -spriteSize * trial.scaling / 2, 
                                        spriteSize * trial.scaling, spriteSize * trial.scaling);
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
                                        placed = true;
                                    }
                                }
                            }
                        }
                    }
                    img.src = shownImage;
                    console.log("img.src:",img.src);
                }

                /* show_images(trial.stimulus[0]);
                console.log(trial.stimulus[0]); */




                // get/set image height and width - this can only be done after image loads because uses image's naturalWidth/naturalHeight properties
                const getHeightWidth = () => {
                    if (trial.stimulus_height !== null) {
                        height = trial.stimulus_height;
                        if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
                            width = img.naturalWidth * (trial.stimulus_height / img.naturalHeight);
                        }
                    }
                    else {
                        height = img.naturalHeight;
                    }
                    if (trial.stimulus_width !== null) {
                        width = trial.stimulus_width;
                        if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
                            height = img.naturalHeight * (trial.stimulus_width / img.naturalWidth);
                        }
                    }
                    else if (!(trial.stimulus_height !== null && trial.maintain_aspect_ratio)) {
                        // if stimulus width is null, only use the image's natural width if the width value wasn't set
                        // in the if statement above, based on a specified height and maintain_aspect_ratio = true
                        width = img.naturalWidth;
                    }
                    canvas.height = height;
                    canvas.width = width;
                };
                getHeightWidth(); // call now, in case image loads immediately (is cached)
                // create container with slider and labels
                var slider_container = document.createElement("div");
                slider_container.classList.add("jspsych-image-slider-response-container");
                slider_container.style.position = "relative";
                slider_container.style.margin = "0 auto 3em auto";
                if (trial.slider_width !== null) {
                    slider_container.style.width = trial.slider_width.toString() + "px";
                }
                // create html string with slider and labels, and add to slider container
                html =
                    '<input type="range" class="jspsych-slider" value="' +
                        trial.slider_start +
                        '" min="' +
                        trial.min +
                        '" max="' +
                        trial.max +
                        '" step="' +
                        trial.step +
                        '" id="jspsych-image-slider-response-response"></input>';
                html += "<div>";
                for (var j = 0; j < trial.labels.length; j++) {
                    var label_width_perc = 100 / (trial.labels.length - 1);
                    var percent_of_range = j * (100 / (trial.labels.length - 1));
                    var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                    var offset = (percent_dist_from_center * half_thumb_width) / 100;
                    html +=
                        '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                            "left:calc(" +
                            percent_of_range +
                            "% - (" +
                            label_width_perc +
                            "% / 2) - " +
                            offset +
                            "px); text-align: center; width: " +
                            label_width_perc +
                            '%;">';
                    html += '<span style="text-align: center; font-size: 80%;">' + trial.labels[j] + "</span>";
                    html += "</div>";
                }
  
                html +='<div id="slider-value" style="position: absolute; top: -25px;">' +
                    trial.slider_start.toString() +
                    '</div>';
  
                html += "</div>";
                slider_container.innerHTML = html;
                // add canvas and slider to content wrapper div
                content_wrapper.insertBefore(canvas, content_wrapper.firstElementChild);
                content_wrapper.insertBefore(slider_container, canvas.nextElementSibling);
                // add content wrapper div to screen and draw image on canvas
                display_element.insertBefore(content_wrapper, null);
  
                // if (img.complete && Number.isFinite(width) && Number.isFinite(height)) {
                //     // if image has loaded and width/height have been set, then draw it now
                //     // (don't rely on img onload function to draw image when image is in the cache, because that causes a delay in the image presentation)
                //     ctx.drawImage(img, 0, 0, width, height);
                //     image_drawn = true;
                // }
  
                // add prompt if there is one
                if (trial.prompt !== null) {
                    display_element.insertAdjacentHTML("beforeend", trial.prompt);
                }
                if (trial.callibration =="callibration") {
                    display_element.insertAdjacentHTML("beforeend", "This display contains <b> "+trial.numerosity+"</b> objects <br>");
                }
                // add submit button
                var submit_btn = document.createElement("button");
                submit_btn.id = "jspsych-image-slider-response-next";
                submit_btn.classList.add("jspsych-btn");
                submit_btn.disabled = trial.require_movement ? true : false;
                submit_btn.innerHTML = trial.button_label;
                display_element.insertBefore(submit_btn, display_element.nextElementSibling);
            }
  
  
  
  
  
  
  
  
  
            var response = {
                rt: null,
                response: null,
            };
  
            // var slider = display_element.querySelector("#jspsych-image-slider-response-response");
            // var valueDisplay = display_element.querySelector("#slider-value");
  
            // Update display on slider input
            // slider.addEventListener('input', function() {
            //     valueDisplay.innerHTML = this.value;
            // });
            var slider = display_element.querySelector("#jspsych-image-slider-response-response");
            var valueDisplay = display_element.querySelector("#slider-value");
            var sliderContainer = display_element.querySelector(".slider-container");
            function updateValuePosition() {
              var sliderWidth = slider.offsetWidth;
              var min = parseInt(slider.min);
              var max = parseInt(slider.max);
              var currentValue = parseInt(slider.value);
              var relativePosition = (currentValue - min) / (max - min);
              var handlePosition = relativePosition * sliderWidth;
              var offset = valueDisplay.offsetWidth / 2; // Center the display value
              valueDisplay.style.left = (handlePosition - offset) + 'px';
            }
            updateValuePosition();
  
            // Update display on slider input
            slider.addEventListener('input', function() {
                valueDisplay.innerHTML = this.value;
                updateValuePosition(); // Update the position of the value display
            });

            console.log("a");
            if (trial.require_movement) {
                const enable_button = () => {
                    display_element.querySelector("#jspsych-image-slider-response-next").disabled = false;
                };
                display_element
                    .querySelector("#jspsych-image-slider-response-response")
                    .addEventListener("mousedown", enable_button);
                display_element
                    .querySelector("#jspsych-image-slider-response-response")
                    .addEventListener("touchstart", enable_button);
                display_element
                    .querySelector("#jspsych-image-slider-response-response")
                    .addEventListener("change", enable_button);
            }
            console.log("b");
            const end_trial = () => {
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // save data
                var trialdata = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    slider_start: trial.slider_start,
                    // sprites:trial.sprites,
                    response: response.response,
                    absDeviation:Math.abs(response.response-trial.numerosity)
                };
                display_element.innerHTML = "";
                // next trial
                this.jsPsych.finishTrial(trialdata);
            };
            console.log("c");
            display_element
                .querySelector("#jspsych-image-slider-response-next")
                .addEventListener("click", () => {
                    console.log("c1");
                // measure response time
                var endTime = performance.now();
                response.rt = Math.round(endTime - startTime);
                response.response = display_element.querySelector("#jspsych-image-slider-response-response").valueAsNumber;
                console.log("c2");
                if (trial.response_ends_trial) {
                    console.log("after response only");
                    end_trial();
                }
                else {
                    console.log("end trial");
                    display_element.querySelector("#jspsych-image-slider-response-next").disabled = true;
                }
            });
            console.log("d");
            // hide the pictures if time is out
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    display_element.querySelector("#jspsych-image-slider-response-stimulus").style.visibility = "hidden";
                }, trial.stimulus_duration);
            }
            console.log("e");
  
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    end_trial();
                }, trial.trial_duration);
              }
            var startTime = performance.now();
        }
  
  
  
       
    }
    ImageSliderResponsePlugin.info = info;
  
    return ImageSliderResponsePlugin;
  
  })(jsPsychModule);
  