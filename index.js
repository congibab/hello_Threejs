let camera, scene, renderer;

init();
GameLoop();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry();
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    clock = new THREE.Clock();
    delta = 0;
}

function update() {

    delta = clock.getDelta();
    cube.rotation.x += 1 * delta;
    cube.rotation.y += 1 * delta;
    cube.material.color.setRGB(0, 1, 1);
};

function render() {
    renderer.render(scene, camera);
};

function GameLoop() {
    requestAnimationFrame(GameLoop);

    update();
    render();
};