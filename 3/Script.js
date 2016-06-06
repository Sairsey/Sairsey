function ThreeStart() {
    InitCanvas();
    InitThreeGL();
    InitScene();
    InitCamera();
    InitClock();
    InitLight();
    InitGeometry();
    InitMaterials();
    LoadDalek();
    LoadDeadPool();
    MeshAll();
    tick();
}

var width;
var height;
var canvas;
var stats;

function InitCanvas() {
    width = window.innerWidth - 20;
    height = window.innerHeight - 22;
    canvas = document.getElementById("canvas");
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
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
var refractioncamera;

function InitCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, 0, 1000);
    scene.add(camera);
    cubecamera = new THREE.CubeCamera(0.1, 5000, 512);
    scene.add(cubecamera);
    refractioncamera = new THREE.CubeCamera(0.1, 5000, 2048);
    refractioncamera.renderTarget.mapping = THREE.CubeRefractionMapping;
    scene.add(refractioncamera);

}

function InitLight() {
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 1000, 100);
    scene.add(spotLight);

    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

}

var Sphere;
var toruss = [];
var Torus;
var Plane;
var Skybox;

function InitGeometry() {
    Sphere = new THREE.SphereGeometry(100, 12, 12);
    Plane = new THREE.PlaneGeometry(100, 100, 100, 100);
    Skybox = new THREE.BoxGeometry(2000, 2000, 2000);
    Torus = new THREE.TorusGeometry(10, 3, 30, 30);
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
var chromeMaterial;
var glassMaterial;
var TorusMaterial;

function InitMaterials() {
    Sphere_material = new THREE.MeshLambertMaterial({color: 0x00ff00});
    Plane_material = new THREE.MeshLambertMaterial({color: 0x0000ff});

    chromeMaterial = new THREE.MeshLambertMaterial({envMap: cubecamera.renderTarget});

    glassMaterial = new THREE.MeshLambertMaterial({envMap: refractioncamera.renderTarget, refractionRatio: 0.95});

    Shader_Material = new THREE.ShaderMaterial({
        uniforms: {
            "uSampler": {
                type: "t", value: THREE.ImageUtils.loadTextureCube(["skybox/rainbow_rt.jpg", "skybox/rainbow_lf.jpg", // cube texture
                    "skybox/rainbow_up.jpg", "skybox/rainbow_dn.jpg",
                    "skybox/rainbow_ft.jpg", "skybox/rainbow_bk.jpg"])
            }
        },
        vertexShader: readFile("shader.vert"),
        fragmentShader: readFile("shader.frag"),
    });
    Shader_Material.side = THREE.DoubleSide;

    TorusMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var Sphere_mesh;
var Sphere2_mesh;
var Plane_mesh;
var Skybox_mesh;

function LoadDalek() {
    var objLoader = new THREE.OBJLoader();
    objLoader.setPath('models/DALEK/');
    objLoader.load('dalek.obj', function (object) {

        object.traverse( function(child) {
            if (child instanceof THREE.Mesh) {
                // apply custom material
                child.material = glassMaterial;
            }
        });
        object.position.x = 30;
        object.position.z = 250;
        scene.add(object);
    });
}


function MeshAll() {
    var Vec = new THREE.Vector3(1, 0, 0)
    Sphere_mesh = new THREE.Mesh(Sphere, glassMaterial);
    Sphere_mesh.position.x = 30;
    Sphere_mesh.position.z = 250;
    //scene.add(Sphere_mesh);

    Plane_mesh = new THREE.Mesh(Plane, Plane_material);
    Plane_mesh.rotateOnAxis(Vec, -Math.PI / 180.0 * 90);
    Plane_mesh.position.y = -100
    Plane_mesh.scale.set(20, 20, 20);
    //scene.add(Plane_mesh);

    Skybox_mesh = new THREE.Mesh(Skybox, Shader_Material);
    Skybox_mesh.scale.set(200, 200, 200);
    scene.add(Skybox_mesh);
    Skybox_mesh.doubleSided = true;

    for (var i = 0; i < 50; i++) {
        var mesh = new THREE.Mesh(Torus, TorusMaterial);
        mesh.position.x = Math.random() * 1000 - 50;
        mesh.position.y = Math.random() * 1000 - 50;
        mesh.position.z = Math.random() * 1000 - 50;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh);
        toruss.push(mesh);
    }

    Sphere2_mesh = new THREE.Mesh(Sphere, chromeMaterial);
    Sphere2_mesh.position.x = 30;
    Sphere2_mesh.position.z = -250;
    scene.add(Sphere2_mesh);
}
var Angle = 180;
var Angle2 = 0;
var Scale = 300;

function tick() {
    var Vec = new THREE.Vector3(0, 0, 0);
    window.requestAnimationFrame(tick);


    stats.begin();

    Sphere2_mesh.visible = false;
    cubecamera.position.copy(Sphere2_mesh.position);
    cubecamera.updateCubeMap(renderer, scene);
    Sphere2_mesh.visible = true;

    Sphere_mesh.visible = false;
    refractioncamera.position.copy(Sphere_mesh.position);
    refractioncamera.updateCubeMap(renderer, scene);
    Sphere_mesh.visible = true;

    camera.position.x = Math.sin(degToRad(Angle)) * Scale * Math.cos(degToRad(Angle2));
    camera.position.y = Math.sin(degToRad(Angle2)) * Scale;
    camera.position.z = Math.cos(degToRad(Angle)) * Scale * Math.cos(degToRad(Angle2));
    camera.lookAt(Vec);

    var timer = 0.01 * clock.getElapsedTime();
    for (var i = 0, il = toruss.length; i < il; i++) {
        var torus = toruss[i];
        torus.position.x = 500 * Math.cos(timer + i);
        torus.position.y = 500 * Math.sin(timer + i * 1.1);
    }

    renderer.render(scene, camera);
    stats.end();
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