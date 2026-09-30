import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ================================
// SETUP
// ================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    80,
    500
);


// CAMERA

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 12);


// RENDERER

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// ================================
// LIGHT
// ================================

const ambientLight =
    new THREE.HemisphereLight(
        0xffffff,
        0x557755,
        2
    );

scene.add(ambientLight);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

sun.position.set(50, 100, 50);

sun.castShadow = true;

scene.add(sun);


// ================================
// MATERIALS
// ================================

const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x333333
    });


const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d8c40
    });


const carMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x2277ff,
        metalness: 0.3,
        roughness: 0.3
    });


const wheelMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x111111
    });


const barrierMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xff3344
    });


// ================================
// GROUND
// ================================

const ground =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            500,
            1,
            500
        ),
        grassMaterial
    );

ground.position.y = -1;

ground.receiveShadow = true;

scene.add(ground);


// ================================
// ROAD
// ================================

const roadWidth = 14;

const road =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            roadWidth,
            0.5,
            500
        ),
        roadMaterial
    );

road.position.set(
    0,
    -0.5,
    -220
);

road.receiveShadow = true;

scene.add(road);


// ================================
// ROAD EDGES
// ================================

function createBarrier(x) {

    const barrier =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.5,
                0.7,
                500
            ),
            barrierMaterial
        );

    barrier.position.set(
        x,
        0,
        -220
    );

    barrier.castShadow = true;

    scene.add(barrier);
}


createBarrier(-7);

createBarrier(7);


// ================================
// ROAD MARKINGS
// ================================

for (
    let z = 0;
    z > -500;
    z -= 12
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.3,
                0.05,
                6
            ),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

    line.position.set(
        0,
        -0.2,
        z
    );

    scene.add(line);
}


// ================================
// CAR
// ================================

const car = new THREE.Group();

scene.add(car);


// CAR BODY

const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            2.2,
            0.7,
            4
        ),
        carMaterial
    );

body.position.y = 0.8;

body.castShadow = true;

car.add(body);


// CAR ROOF

const roof =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1.5,
            0.6,
            1.7
        ),
        new THREE.MeshStandardMaterial({
            color: 0x111827
        })
    );

roof.position.set(
    0,
    1.35,
    0.2
);

roof.castShadow = true;

car.add(roof);


// ================================
// WHEELS
// ================================

function createWheel(x, z) {

    const wheel =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.48,
                0.48,
                0.35,
                20
            ),
            wheelMaterial
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        x,
        0.45,
        z
    );

    wheel.castShadow = true;

    car.add(wheel);
}


createWheel(-1.05, -1.3);

createWheel(1.05, -1.3);

createWheel(-1.05, 1.3);

createWheel(1.05, 1.3);


// ================================
// CAR POSITION
// ================================

car.position.set(
    0,
    0,
    0
);


// ================================
// GAME VARIABLES
// ================================

let gameStarted = false;

let gameFinished = false;

let startTime = 0;

let speed = 0;

const maxSpeed = 1.2;

const acceleration = 0.018;

const braking = 0.035;

const friction = 0.008;

const steeringPower = 0.06;

const keys = {};


// ================================
// KEYBOARD
// ================================

window.addEventListener(
    "keydown",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = true;

    }
);


window.addEventListener(
    "keyup",
    function(event) {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


// ================================
// START GAME
// ================================

const startButton =
    document.getElementById(
        "startButton"
    );


startButton.addEventListener(
    "click",
    function() {

        console.log("RACE STARTED");

        gameStarted = true;

        gameFinished = false;

        startTime =
            performance.now();

        speed = 0;

        car.position.set(
            0,
            0,
            0
        );

        document.getElementById(
            "startScreen"
        ).style.display = "none";

    }
);


// ================================
// RESTART
// ================================

const restartButton =
    document.getElementById(
        "restartButton"
    );


restartButton.addEventListener(
    "click",
    function() {

        gameStarted = true;

        gameFinished = false;

        startTime =
            performance.now();

        speed = 0;

        car.position.set(
            0,
            0,
            0
        );

        document.getElementById(
            "finishScreen"
        ).style.display = "none";

    }
);


// ================================
// CAR MOVEMENT
// ================================

function updateCar() {

    if (!gameStarted) {
        return;
    }


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        speed += acceleration;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        speed -= braking;

    }


    if (
        !keys["w"] &&
        !keys["arrowup"] &&
        !keys["s"] &&
        !keys["arrowdown"]
    ) {

        speed -= friction;

    }


    speed = Math.max(
        0,
        Math.min(
            maxSpeed,
            speed
        )
    );


    let steering = 0;


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        steering = -1;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        steering = 1;

    }


    car.position.x +=
        steering *
        speed *
        0.7;


    car.position.z -=
        speed;


    car.rotation.z =
        -steering * 0.12;


    // Keep car on track

    if (car.position.x < -5.5) {

        car.position.x = -5.5;

    }


    if (car.position.x > 5.5) {

        car.position.x = 5.5;

    }
}


// ================================
// CAMERA
// ================================

function updateCamera() {

    const target =
        new THREE.Vector3(
            car.position.x,
            car.position.y + 4,
            car.position.z + 10
        );


    camera.position.lerp(
        target,
        0.08
    );


    camera.lookAt(
        car.position.x,
        car.position.y + 0.8,
        car.position.z - 15
    );
}


// ================================
// TIMER
// ================================

function updateTimer() {

    if (!gameStarted) {
        return;
    }


    const elapsed =
        performance.now() -
        startTime;


    const seconds =
        elapsed / 1000;


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    const milliseconds =
        Math.floor(
            elapsed % 1000
        );


    const text =
        String(minutes).padStart(2, "0")
        + ":"
        +
        String(remainingSeconds).padStart(2, "0")
        + "."
        +
        String(milliseconds).padStart(3, "0");


    document.getElementById(
        "timer"
    ).textContent = text;
}


// ================================
// FINISH
// ================================

function checkFinish() {

    if (
        car.position.z < -480 &&
        !gameFinished
    ) {

        gameFinished = true;

        speed = 0;


        document.getElementById(
            "finishScreen"
        ).style.display = "flex";


        document.getElementById(
            "finalTime"
        ).textContent =
            document.getElementById(
                "timer"
            ).textContent;
    }
}


// ================================
// GAME LOOP
// ================================

function animate() {

    requestAnimationFrame(
        animate
    );


    updateCar();

    updateCamera();

    updateTimer();

    checkFinish();


    renderer.render(
        scene,
        camera
    );
}


animate();


// ================================
// RESIZE
// ================================

window.addEventListener(
    "resize",
    function() {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
