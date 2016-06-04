function ThreeStart() {
    InitCanvas();
    InitThreeGL();
    InitScene();
    InitCamera();
    InitClock();
    InitLight();
    InitGeometry();
    InitMaterials();
    LoadDeadPool();
    MeshAll();
    tick();
}

var width;
var height;
var canvas;

function InitCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas = document.getElementById("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
}

var clock;

function InitClock() {
    clock = new THREE.Clock();
}

var renderer;

function LoadDeadPool() {
    var Vec = new THREE.Vector3(0, 1, 0);
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'models/Deadpool/' );
    mtlLoader.load( 'dead_123456.mtl', function( materials ) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath('models/Deadpool/');
        objLoader.load('dead 123456.obj', function (object) {
            object.rotateOnAxis(Vec, -Math.PI / 180.0 * 90);
            object.position.z = 550;
            object.position.y = -100;
            scene.add(object);
        });
    });
}


function InitThreeGL() {
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x0000000);
}

var scene;

function InitScene() {
    scene = new THREE.Scene();
}

var camera;

function InitCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
    camera.position.set(0, 0, 1000);
}

function InitLight() {
    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 ).normalize();
    scene.add( directionalLight );
}

var Sphere;

function InitGeometry() {
    Sphere = new THREE.SphereGeometry(200, 12, 12);
}
var Sphere_material;

function InitMaterials() {
    Sphere_material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
}
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var Sphere_mesh;

function MeshAll() {
    Sphere_mesh = new THREE.Mesh(Sphere, Sphere_material);
    scene.add(Sphere_mesh);
}
function tick() {
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}
