 import * as THREE from "./build/three.module.js";
 import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
 import Stats from './examples/jsm/libs/stats.module.js';
 import { GLTFLoader } from "./examples/jsm/loaders/GLTFLoader.js";
//import { GUI } from "https://threejs.org/examples/jsm/libs/dat.gui.module.js"

function init() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    var delta = 0;


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
//==============================================================
//==============================================================

    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.TextureLoader().load("textures/brick_roughness.jpg");

    const uniforms = {
        "time": { value: 1.0 },
        "texture1" : {value: texture}
    };

    const material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent

    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.z = 5;

    function animate() {

        stats.begin();
        delta = clock.getDelta();
        uniforms['time'].value = Math.sin(clock.getElapsedTime());
        cube.rotation.x += delta;
        cube.rotation.y += delta;
        stats.end();

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}
init();