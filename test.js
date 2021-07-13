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


    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    //==============================================================
    //==============================================================

    const geometry = new THREE.BoxGeometry();
    const texture = new THREE.TextureLoader().load("textures/UV_Grid_Sm.jpg");

    const uniforms = {
        "time": { value: 1.0 },
        "texture1": { value: texture }
    };

    const material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent,
        wireframe : false
    });

    const geometry_buffer = new THREE.BufferGeometry();
    const Cube_geometryPosition = geometry.attributes.position.array;
    const Cube_normal = geometry.attributes.normal.array;
    const Cube_uv = geometry.attributes.uv.array;
    
    const index = geometry.index.array;

    let cPosition = new Float32Array(index.length * 3);
    let cUv = new Float32Array(Cube_uv.length * 2);
    let cNormal = new Float32Array(Cube_uv.length * 3);

    for (let i = 0; i < index.length; i++) {
        cPosition[i * 3 + 0] = Cube_geometryPosition[index[i] * 3 + 0]
        cPosition[i * 3 + 1] = Cube_geometryPosition[index[i] * 3 + 1]
        cPosition[i * 3 + 2] = Cube_geometryPosition[index[i] * 3 + 2]
    }

    for (let i = 0; i < index.length; i++) {
        cUv[i * 2 + 0] = Cube_uv[index[i] * 2 + 0];
        cUv[i * 2 + 1] = Cube_uv[index[i] * 2 + 1];
    }   

    for (let i = 0; i < index.length; i++) {
        cNormal[i * 3 + 0] = Cube_normal[index[i] * 3 + 0];
        cNormal[i * 3 + 1] = Cube_normal[index[i] * 3 + 1];
        cNormal[i * 3 + 2] = Cube_normal[index[i] * 3 + 2];
    }

    geometry_buffer.setAttribute('position', new THREE.BufferAttribute(cPosition, 3))
    geometry_buffer.setAttribute('uv', new THREE.BufferAttribute(cUv, 2))
    geometry_buffer.setAttribute('normal', new THREE.BufferAttribute(cNormal, 3))

    const cube = new THREE.Mesh(geometry_buffer, material);
    scene.add(cube);

    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    camera.position.z = 5;

    function animate() {

        delta = clock.getDelta();
        uniforms['time'].value = Math.sin(clock.getElapsedTime());
        //cube.rotation.x += delta;
        //cube.rotation.y += delta;
        stats.update();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}
init();