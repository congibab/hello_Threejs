import * as THREE from "../build/three.module.js";
import { PointerLockControls } from "../examples/jsm/controls/PointerLockControls.js";
import Stats from '../examples/jsm/libs/stats.module.js';
import { OBJLoader } from '../examples/jsm/loaders/OBJLoader.js';
//import { MTLLoader } from '../examples/jsm/loaders/MTLLoader.js';


function init() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    let delta = 0;

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;

    let velocity = new THREE.Vector3();
    let Camera_direction = new THREE.Vector3();
    let Camera_right = new THREE.Vector3();

    //SkyBox
    //================================================
    const skyTextures = new THREE.CubeTextureLoader().load([
        '../textures/skybox/right.jpg',
        '../textures/skybox/left.jpg',
        '../textures/skybox/top.jpg',
        '../textures/skybox/bottom.jpg',
        '../textures/skybox/front.jpg',
        '../textures/skybox/back.jpg'
    ]);
    scene.background = skyTextures;
    //================================================


    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256,
        {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilterm,
            encoding: THREE.sRGBEncoding
        });

    const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    scene.add(cubeCamera);


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 1, 0);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
        envMap: cubeRenderTarget.texture,
        combine: THREE.MultiplyOperation,
        reflectivity: 1
    });

    const texture2 = new THREE.TextureLoader().load('../textures/UV_Grid_Sm.jpg')
    const material2 = new THREE.MeshBasicMaterial({ map: texture2 });

    const cube = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry, material2);
    scene.add(cube);
    scene.add(cube2);
    cube2.position.x = 2;

    //========================================
    const objLoader = new OBJLoader();
    objLoader.load('../model/bunny.obj', (obj) => {

        const head = obj.children[0];
        head.material = material;
        head.position.x = -2;
        scene.add(head);

    })

    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    const controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';
    })

    scene.add(controls.getObject());


    function animate() {

        if(controls.isLocked === true){
            stats.begin();
            delta = clock.getDelta();
    
            //Camera movement0
            //=============================
            controls.getDirection(Camera_direction);
            Camera_right.crossVectors(camera.up , Camera_direction);
    
            if (moveForward || moveBackward) {
                velocity = Camera_direction.multiplyScalar(delta * (Number(moveForward) - Number(moveBackward)));
                camera.position.addVectors(camera.position ,velocity);
            }
    
            if (moveRight || moveLeft) {
                velocity = Camera_right.multiplyScalar(delta * (Number(moveLeft) - Number(moveRight)));
                camera.position.addVectors(camera.position ,velocity);
            }
            //=============================
    
            cube.rotation.x += delta;
            cube.rotation.y += delta;
        } 

        cubeCamera.update(renderer, scene);
        renderer.render(scene, camera);

        requestAnimationFrame(animate);
        stats.end();
    };

    document.addEventListener("keydown", onkeydown);
    document.addEventListener("keyup", onkeyup);
    function onkeydown(event) {

        switch (event.code) {

            case 'KeyW':
                moveForward = true;
                break;

            case 'KeyS':
                moveBackward = true;
                break;


            case 'KeyA':
                moveLeft = true;
                break;


            case 'KeyD':
                moveRight = true;
                break;
        }
    }

    function onkeyup(event) {

        switch (event.code) {

            case 'KeyW':
                moveForward = false;
                break;

            case 'KeyS':
                moveBackward = false;
                break;

            case 'KeyA':
                moveLeft = false;
                break;

            case 'KeyD':
                moveRight = false;
                break;
        }
    }

    animate();
}
init();