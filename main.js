let rotating = false;
let moving = false;
let planetChanging = null;
let raycaster = new THREE.Raycaster();
let mousePos = new THREE.Vector2();
let lastMousePos = {x : 0, y : 0};

let displayScreen = document.getElementById('universe-holder');
let width = displayScreen.getBoundingClientRect().width;
let height = displayScreen.getBoundingClientRect().height;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

displayScreen.appendChild(renderer.domElement);

createPlanet(1024, 1024);

camera.position.z = 20;

animate();

function animate() {
    camera.updateMatrixWorld();

    raycaster.setFromCamera(mousePos, camera);
    intersectedObjects = raycaster.intersectObjects(scene.children);
    
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function perlinToTexture (width, height, backgroundGrid) {
    let size = width * height;
    let data = new Uint8Array(3 * size);

    let y = 0;
    let x = 0;

    for (var i = 0; i < size; i++) {
        let stride = i * 3;
        let colour = getColour(y, x, backgroundGrid);

        data[stride] = colour.red;
        data[stride + 1] = colour.green;
        data[stride + 2] = colour.blue;

        x++;
        if (x >= width) { 
            x = 0;
            y++;
        }
    }

    let texture = new THREE.DataTexture(data, width, height, THREE.RGBFormat);
    texture.needsUpdate = true;

    return texture;
}

function createPlanet (width, height) {
    let perlinGrid = generatePerlinNoise(width, height);

    let planetGeometry = new THREE.SphereGeometry(5, 32, 32);
    let map2D = perlinToTexture(width, height, perlinGrid);
    let planetMaterial = new THREE.MeshBasicMaterial({
        map : map2D
    });
    let planet = new THREE.Mesh(planetGeometry, planetMaterial);

    scene.add(planet);
}

displayScreen.oncontextmenu = function (ev) {
    ev.preventDefault();
}

displayScreen.onmousedown = function (ev) {
    if (intersectedObjects.length > 0) {
        planetChanging = intersectedObjects[0].object;
        if (ev.button == 0) {
            moving = true;
        } else if (ev.button == 2) {
            rotating = true;
        }
        lastMousePos = {x : ev.clientX, y : ev.clientY};
    }
}

displayScreen.onmousemove = function (ev) {
    mousePos.x = (ev.clientX / width) * 2 - 1;
    mousePos.y = -(ev.clientY / height) * 2 + 1;
    
    if (rotating) {
        let currentMousePos = {x : ev.clientX, y : ev.clientY};
        let upVec = new THREE.Vector3(0, 1, 0);
        let horVec = new THREE.Vector3(1, 0, 0);

        if (lastMousePos.x > currentMousePos.x) {
            planetChanging.rotateOnWorldAxis(upVec, -0.05);
        } else if (lastMousePos.x < currentMousePos.x) {
            planetChanging.rotateOnWorldAxis(upVec, 0.05);
            //planet.rotateY(0.1);
        }

        if (lastMousePos.y > currentMousePos.y) {
            planetChanging.rotateOnWorldAxis(horVec, -0.05);
        } else if (lastMousePos.y < currentMousePos.y) {
            planetChanging.rotateOnWorldAxis(horVec, 0.05);
        }

        lastMousePos = currentMousePos;
    } else if (moving) {
        var vector = new THREE.Vector3();

        vector.set(
            ( event.clientX / width ) * 2 - 1,
            - ( event.clientY / height ) * 2 + 1,
            0.5 );

        vector.unproject( camera );

        var dir = vector.sub( camera.position ).normalize();

        var distance = - camera.position.z / dir.z;

        var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        
        planetChanging.position.x = pos.x;
        planetChanging.position.y = pos.y;
    }
}

displayScreen.onmouseup = function (ev) {
    rotating = false;
    moving = false;
    planetChanging = null;
    lastMousePos = {x : 0, y : 0};
}

displayScreen.onmouseleave = function (ev) {
    rotating = false;
    moving = false;
    planetChanging = null;
    lastMousePos = {x : 0, y : 0};
}

displayScreen.onwheel = function (ev) {
    ev.preventDefault();
    if (ev.deltaY < 0) {
        camera.position.z += 0.1;
    } else if (ev.deltaY > 0) {
        camera.position.z -= 0.1;
    }
}

window.onkeypress = function (ev) {
    if (ev.code == "KeyR") {
        createPlanet(1024, 1024);
    }
}