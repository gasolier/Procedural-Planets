var p5 = new p5();

function hexToRgb (hexString) {
    return {
        red : parseInt(hexString.slice(1, 3), 16),
        green : parseInt(hexString.slice(3, 5), 16),
        blue : parseInt(hexString.slice(5, 7), 16)
    }
}

function generatePerlinNumber (x, y, width, height, offset) {
    let s = x / width;
    let t = y / height;

    let nx = Math.cos(s * 2 * Math.PI) * Math.sin(t * 2 * Math.PI) + offset;
    let ny = Math.sin(s * 2 * Math.PI) * Math.sin(t * 2 * Math.PI) + offset;
    let nz = Math.cos(t * 2 * Math.PI) + offset;

    return p5.noise(nx, ny, nz);
}

function generatePerlinNoise (width, height) {
    p5.noiseSeed(Math.floor(Math.random() * 10000));
    let returnGrid = new Array();

    for (let y = 0; y < height; y++) {
        let col = new Array();
        for (let x = 0; x < width; x++) {
            let elevation = generatePerlinNumber(x, y, width, height, 0) * 100;
            let precipitation = generatePerlinNumber(x, y, width, height, 100) * 500;
            let temperature = generatePerlinNumber(x, y, width, height, -100) * 50;

            col.push({
                elevation : elevation,
                precipitation : precipitation,
                temperature : temperature
            });
        }
        returnGrid.push(col);
    }

    return returnGrid;
}

function getColour (x, y, backgroundGrid) {
    let returnColour = "none";
    
    let elevation = backgroundGrid[y][x].elevation;
    let precipitation = backgroundGrid[y][x].precipitation;
    let temperature = backgroundGrid[y][x].temperature;

    if (elevation < 30) {
        if (temperature < 5) {
            // tundra
            returnColour = hexToRgb("#93a9ad");
        } else {
            returnColour = hexToRgb("#00546b");
        }
    } else {
        if (temperature < 10) {
            if (precipitation < 100) {
                // #93a9ad, tundra
                returnColour = hexToRgb('#93a9ad');
            }
        } else if (temperature < 20) {
            if (precipitation < 20) {
                // #947e3b, temperate grassland/cold desert
                returnColour = hexToRgb('#947e3b');
            } else if (precipitation < 40) {
                // #b77c28, woodland/shrubland
                returnColour = hexToRgb('#b77c28');
            } else if (precipitation < 200) {
                // #579059, boreal forest
                returnColour = hexToRgb('#579059');
            }
        } else if (temperature < 30) {
            if (precipitation < 50) {
                // #947e3b, temperate grassland/cold desert
                returnColour = hexToRgb('#947e3b');
            } else if (precipitation < 130) {
                // #b77c28, woodland/shrubland
                returnColour = hexToRgb('#b77c28');
            } else if (precipitation < 230) {
                // #95df96, temperate seasonal forest
                returnColour = hexToRgb('#95df96');
            } else if (precipitation < 320) {
                // #39b73b, temperate rainforest
                returnColour = hexToRgb('#39b73b');
            }
        } else if (temperature < 40) {
            if (precipitation < 100) {
                // #cc703f, subtropical desert
                returnColour = hexToRgb('#cc703f');
            } else if (precipitation < 280) {
                // #97a63f, tropical seasonal forest/savanna
                returnColour = hexToRgb('#97a63f');
            } else if (precipitation < 460) {
                // #005231, tropical rainforest
                returnColour = hexToRgb('#005231');
            }
        }
    }

    if (returnColour == "none") {
        returnColour = hexToRgb("#00546b");
    }
    
    return returnColour;
}