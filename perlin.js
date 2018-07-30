function map(x, s1, e1, s2, e2) {
    return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
}

function hexToRgb (hexString) {
    return {
        red : parseInt(hexString.slice(1, 3), 16),
        green : parseInt(hexString.slice(3, 5), 16),
        blue : parseInt(hexString.slice(5, 7), 16)
    }
}

function generatePerlinNumber (x, y, width, height, x1, x2, y1, y2, offset, generator) {
    let s = x / width;
    let t = y / height;
    let dx = x2 - x1;
    let dy = y2 - y1;

    let pi = Math.PI;

    let nx = x1 + Math.cos(s * 2 * pi) * dx / (2 * pi);
    let ny = y1 + Math.cos(t * 2 * pi) * dy / (2 * pi);
    let nz = x1 + Math.sin(s * 2 * pi) * dx / (2 * pi);
    let nw = y1 + Math.sin(t * 2 * pi) * dy / (2 * pi);

    let val = generator.noise4D(nx + offset, ny + offset, nz + offset, nw + offset);

    return map(val, -1, 1, 0, 1);
}

function generatePerlinNoise (width, height) {
    let simplex = new SimplexNoise(Math.random());

    let returnGrid = new Array();

    for (let y = 0; y < height; y++) {
        let col = new Array();
        for (let x = 0; x < width; x++) {
            let elevation = generatePerlinNumber(x, y, width, height, -1, 1, -1, 1, 100, simplex) * 100;
            let precipitation = generatePerlinNumber(x, y, width, height, -1, 1, -1, 1, 1000, simplex) * 500;
            let temperature = generatePerlinNumber(x, y, width, height, -1, 1, -1, 1, -1000, simplex) * 50;

            col.push({
                elevation : elevation,
                precipitation : precipitation,
                temperature : temperature
            });
        }
        returnGrid.push(col);
    }

    console.log(returnGrid);

    return returnGrid;
}

function getColour (x, y, backgroundGrid) {
    let returnColour = "none";
    
    let elevation = backgroundGrid[y][x].elevation;
    let precipitation = backgroundGrid[y][x].precipitation;
    let temperature = backgroundGrid[y][x].temperature;

    if (elevation < 30) {
        returnColour = hexToRgb("#00546b");
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