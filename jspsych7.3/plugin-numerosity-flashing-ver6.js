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
                default: null,
            },
            /** How long to show the trial. */
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
            },
            // Frame duration (duration of each object WITHIN  one trial)
            frame_time: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Frame duration",
                default: 100,
            },
            /** Length of gap to be shown between each image. */
            frame_isi: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Frame gap",
                default: 0,
            },
            /** Number of times to show entire sequence */
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
            
            var html;
            // half of the thumb width value from jspsych.css, used to adjust the label positions
            var half_thumb_width = 7.5;

            if (trial.render_on_canvas){

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
                
                const spriteSheets_list = [
                    
                    {image: 'assets/sheet1.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0]],
                    sprites:'animalCrackers'},

                    {image: 'assets/sheet2.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0],
                                [0,1],[1,1],[2,1],[3,1],[4,1],
                                [0,2],[1,2],[2,2],[3,2],[4,2],
                                [0,3],[1,3],[2,3],[3,3],[4,3],
                                [0,4],[1,4],[2,4],[3,4],[4,4],
                                [0,5]],
                    sprites: 'letters'},

                    {image: 'assets/sheet3.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0]], 
                    sprites: "butterflies" },

                    {image: 'assets/sheet4.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0]],
                    sprites:'hearts'},

                    {image: 'assets/sheet5.png',
                    spriteMap: [[0,0],[1,0]],
                    sprites:'crackers'},

                    {image: 'assets/sheet6.png',
                    spriteMap:[[0,0],[1,0],[2,0],[3,0]],
                    sprites:'bears'},

                    {image:'assets/sheet7.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0]],
                    sprites:' fruits'},

                    {image: 'assets/sheet8.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0],
                                [0,1],[1,1],[2,1],[3,1],[4,1],
                                [0,2],[1,2],[2,2],[3,2],[4,2],
                                [0,3],[1,3],[2,3],[3,3],[4,3]],
                    sprites: "jellyBeans" },

                    {image: 'assets/sheet9.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]],
                    sprites: "marbles" },

                    {image: 'assets/sheet10.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0]],
                    sprites: 'mints'},

                    {image: 'assets/sheet11.png',
                    spriteMap: [[0,0],[1,0],[2,0],[3,0]],
                    sprites: 'rocks'},

                    {image: 'assets/sheet12.png', 
                    spriteMap: [[0,0],[1,0],[2,0],[3,0],[4,0],
                                [0,1],[1,1],[2,1],[3,1],[4,1],
                                [0,2],[1,2],[2,2],[3,2],[4,2]],
                    sprites: "buttons" }
                ];               

                
                // make sure objects are presented in the right order
                var spriteSheets = spriteSheets_list
                        .filter(sheet => trial.stimulus.includes(sheet.sprites))
                        .sort((a, b) => trial.stimulus.indexOf(a.sprites) - trial.stimulus.indexOf(b.sprites));

                console.log(spriteSheets);
                const rng = new SeedableRNG(trial.random_seed);

                canvas.width = trial.stimulus_width;
                canvas.height = trial.stimulus_height;
                // generate locations here!!!!
                // needed to put all objects in the same locations
                // Precompute positions and rotations only once
                var spriteSize = 70; 
                let positions = [];
                while (positions.length < trial.numerosity) {
                    let x_loc = Math.floor(rng.random() * (canvas.width - spriteSize));
                    let y_loc = Math.floor(rng.random() * (canvas.height - spriteSize));
                    let rotationAngle = rng.random() * 2 * Math.PI;

                    let overlap = positions.some(pos => {
                        return x_loc < pos.x + spriteSize * trial.scaling &&
                                x_loc + spriteSize * trial.scaling > pos.x &&
                                y_loc < pos.y + spriteSize * trial.scaling &&
                                y_loc + spriteSize * trial.scaling > pos.y;
                    });

                    if (!overlap) {
                        positions.push({
                            x: x_loc,
                            y: y_loc,
                            rotation: rotationAngle,
                        });
                    }
                }


                
                // function to draw images
                let currentSpriteIndex = 0;
                let img = new Image();

                function drawSprites() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    let currentSheet = spriteSheets[currentSpriteIndex];

                    positions.forEach(pos => {
                        // Dynamically choose sprite based on current sheet
                        let sprite = Math.floor(rng.random() * currentSheet.spriteMap.length);

                        let centerX = pos.x + (spriteSize * trial.scaling) / 2;
                        let centerY = pos.y + (spriteSize * trial.scaling) / 2;

                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.rotate(pos.rotation);
                        ctx.drawImage(
                            img,                                            // image source
                            currentSheet.spriteMap[sprite][0] * spriteSize, // x-coordinates on the sprite sheet
                            currentSheet.spriteMap[sprite][1] * spriteSize, // y-coordinates on the sprite sheet
                            spriteSize,                                     // Source width: width of the sprite to cut out
                            spriteSize,                                     // Source height: height of the sprite to cut out
                            // this is where top-left corner will be placed relative to centerX and centerY
                            // so, as a result the image will be placed in [centerX,centerY] - it'll be the center of the image
                            -spriteSize * trial.scaling / 2,                // Destination X: where to place on the canvas (top-left corner)
                            -spriteSize * trial.scaling / 2,                // Destination Y: same, for Y-axis
                            spriteSize * trial.scaling,                     // Destination width: how wide to draw (scaled)
                            spriteSize * trial.scaling                      // Destination height: how tall to draw (scaled)
                        );
                        ctx.restore();
                    });
                }

                // function to show the objects trial.frame_time ms
                // (if it's stationary condition - it will last for the whole trial as
                // stated in the design matrix)
                function animateSprites() {
                    setInterval(() => {
                        currentSpriteIndex = (currentSpriteIndex + 1) % spriteSheets.length;
                        img.src = spriteSheets[currentSpriteIndex].image;
                        img.onload = drawSprites;
                    }, trial.frame_time);
                }

                // Load initial sprite and start animation
                img.src = spriteSheets[currentSpriteIndex].image;
                img.onload = () => {
                    drawSprites();
                    animateSprites();
                };



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
  

            var slider = display_element.querySelector("#jspsych-image-slider-response-response");
            var valueDisplay = display_element.querySelector("#slider-value");
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
            const end_trial = () => {
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // save data
                var trialdata = {
                    rt: response.rt,
                    stimulus: trial.stimulus,
                    // animation_sequence: animation_sequence,
                    slider_start: trial.slider_start,
                    // sprites: sprites_list, // trial.sprites,
                    response: response.response,
                    absDeviation:Math.abs(response.response-trial.numerosity)
                };
                display_element.innerHTML = "";
                // next trial
                this.jsPsych.finishTrial(trialdata);
            };
            display_element
                .querySelector("#jspsych-image-slider-response-next")
                .addEventListener("click", () => {
                // measure response time
                var endTime = performance.now();
                response.rt = Math.round(endTime - startTime);
                response.response = display_element.querySelector("#jspsych-image-slider-response-response").valueAsNumber;
                if (trial.response_ends_trial) {
                  // console.log("after response only");
                    end_trial();
                }
                else {
                    display_element.querySelector("#jspsych-image-slider-response-next").disabled = true;
                }
            });
            // hide the pictures if time is out
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    display_element.querySelector("#jspsych-image-slider-response-stimulus").style.visibility = "hidden";
                }, trial.stimulus_duration);
            }
  
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    end_trial();
                }, trial.trial_duration);
              }
            var startTime = performance.now();
          }
          
  
  
  
        simulate(trial, simulation_mode, simulation_options, load_callback) {
            if (simulation_mode == "data-only") {
                load_callback();
                this.simulate_data_only(trial, simulation_options);
            }
            if (simulation_mode == "visual") {
                this.simulate_visual(trial, simulation_options, load_callback);
            }
        }
        create_simulation_data(trial, simulation_options) {
            const default_data = {
                stimulus: trial.stimulus,
                slider_start: trial.slider_start,
                response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
                rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
            };
            const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
            this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
            return data;
        }
        simulate_data_only(trial, simulation_options) {
            const data = this.create_simulation_data(trial, simulation_options);
            this.jsPsych.finishTrial(data);
        }
        simulate_visual(trial, simulation_options, load_callback) {
            const data = this.create_simulation_data(trial, simulation_options);
            const display_element = this.jsPsych.getDisplayElement();
            this.trial(display_element, trial);
            load_callback();
            if (data.rt !== null) {
                const el = display_element.querySelector("input[type='range']");
                setTimeout(() => {
                    this.jsPsych.pluginAPI.clickTarget(el);
                    el.valueAsNumber = data.response;
                }, data.rt / 2);
                this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
            }
        }
    }
    ImageSliderResponsePlugin.info = info;
  
    return ImageSliderResponsePlugin;
  
  })(jsPsychModule);
  