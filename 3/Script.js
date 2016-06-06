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
    width = window.innerWidth - 20;
    height = window.innerHeight - 22;
    canvas = document.getElementById("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
}

var clock;

function InitClock() {
    clock = new THREE.Clock();
}

var renderer;
var renderercube;

function LoadDeadPool() {
    var Vec = new THREE.Vector3(0, 1, 0);
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/Deadpool/');
    mtlLoader.load('dead_123456.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/Deadpool/');
        objLoader.load('dead 123456.obj', function (object) {
            object.rotateOnAxis(Vec, -Math.PI / 180.0 * 90);
            object.position.z = 0;
            object.position.y = -100;
            object.castShadow = true;
            scene.add(object);
        });
    });
}


function InitThreeGL() {
    renderer = new THREE.WebGLRenderer({canvas: canvas, shadowMapEnabled: true});
    renderer.setClearColor(0x0000000);
    renderercube = new THREE.WebGLRenderTargetCube(512, 512);
    renderer.setClearColor(0x0000000);
}

var scene;

function InitScene() {
    scene = new THREE.Scene();
}

var camera;
var cubecamera;

function InitCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, 0, 1000);
    scene.add(camera);
    cubecamera = new THREE.CubeCamera(0.1, 5000, 512);
    cubecamera.position.set(30, 0, 550);
    scene.add(cubecamera);
}

function InitLight() {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 1000, 100);
    scene.add(spotLight);
}

var Sphere;
var Plane;
var Skybox;

function InitGeometry() {
    Sphere = new THREE.SphereGeometry(100, 12, 12);
    Plane = new THREE.PlaneGeometry(100, 100, 100, 100);
    Skybox = new THREE.BoxBufferGeometry(2000, 2000, 2000);
}
var Sphere_material;
var Plane_material;

function readFile(path) {
    var File = new XMLHttpRequest();
    var txt = "";
    File.open("GET", path, false);
    File.send(null);
    txt = File.responseText;
    return txt;
}

var Shader_Material;
var chromeMaterial

function InitMaterials() {
    Sphere_material = new THREE.MeshLambertMaterial({color: 0x00ff00});
    Plane_material = new THREE.MeshLambertMaterial({color: 0x0000ff});


    chromeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, envMap: cubecamera.renderTarget, refractionRatio: 0.95});

    Shader_Material = new THREE.ShaderMaterial({
        uniforms: {
            "uSampler": {
                type: "t", value: THREE.ImageUtils.loadTextureCube(["skybox/borg_rt.jpg", "skybox/borg_lf.jpg", // cube texture
                    "skybox/borg_up.jpg", "skybox/borg_dn.jpg",
                    "skybox/borg_ft.jpg", "skybox/borg_bk.jpg"])
            }
        },
        vertexShader: readFile("shader.vert"),
        fragmentShader: readFile("shader.frag"),
    });
    Shader_Material.side = THREE.DoubleSide;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var Sphere_mesh;
var Plane_mesh;
var Skybox_mesh;
/* Ti dibil */
function MeshAll() {
    var Vec = new THREE.Vector3(1, 0, 0)
    Sphere_mesh = new THREE.Mesh(Sphere, chromeMaterial);
    Sphere_mesh.position.x = 30;
    Sphere_mesh.castShadow = true;
    Sphere_mesh.position.z = 250;
    scene.add(Sphere_mesh);

    Plane_mesh = new THREE.Mesh(Plane, Plane_material);
    Plane_mesh.rotateOnAxis(Vec, -Math.PI / 180.0 * 90);
    Plane_mesh.position.y = -100
    Plane_mesh.scale.set(20, 20, 20);
    Plane_mesh.receiveShadow = true;
    scene.add(Plane_mesh);

    Skybox_mesh = new THREE.Mesh(Skybox, Shader_Material);
    scene.add(Skybox_mesh);
    Skybox_mesh.doubleSided = true;
}
var Angle = 180;
var Angle2 = 0;
var Scale = 300;

function tick() {
    var Vec = new THREE.Vector3(0, 0, 0);
    window.requestAnimationFrame(tick);

    Sphere_mesh.visible = false;
    cubecamera.position.copy(Sphere_mesh.position);
    cubecamera.updateCubeMap(renderer, scene);

    Sphere_mesh.visible = true;
    camera.position.x = Math.sin(degToRad(Angle)) * Scale * Math.cos(degToRad(Angle2));
    camera.position.y = Math.sin(degToRad(Angle2)) * Scale;
    camera.position.z = Math.cos(degToRad(Angle)) * Scale * Math.cos(degToRad(Angle2));
    camera.lookAt(Vec);
    renderer.render(scene, camera);
}

function wheel() {
    var delta = (event.wheelDelta) ? event.wheelDelta / 120 : event.detail;
    Scale += delta * 10;
}

var IsDrag;

function dragStart() {
    IsDrag = 1;
}

var posX;
var posY;

function dragNow() {
    var e = window.event;
    var rect = document.getElementById('canvas').getBoundingClientRect();
    if (IsDrag) {
        var deltaX, deltaY;
        deltaX = e.clientX - rect.left - posX;
        deltaY = e.clientY - rect.top - posY;
        Angle += deltaX;
        Angle2 += deltaY;
    }
    posX = e.clientX - rect.left;
    posY = e.clientY - rect.top;
}
function dragEnd() {
    IsDrag = 0;
}