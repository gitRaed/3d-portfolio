import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
//a scene is a container that hold all objects, cameras and lights
// So, inside a scene, we need a camera

const texture = new THREE.TextureLoader();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//it is a camera that mimics what human eyeballs see
//first argument is field of view
//second is aspect ratio, based on the user brower window
//2 last arguments are view frustrum, relative to the camera itself


//we now need a renderer to make the magic happen
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30); //moves the camera
camera.position.set(-3);

renderer.render(scene, camera); // renderer.render = draw

//we'll now add an object to our scene
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

//let's wrap that object with a "paper"
const material = new THREE.MeshStandardMaterial({
    color: 0xFF6347
});

//mesh = gemotry + material
const torus = new THREE.Mesh(geometry, material);

//let's add this to the scene
scene.add(torus);


//let's now add lights to the scene
const pointLight = new THREE.PointLight(0xffffff); //0x = color in hexadecimal
pointLight.position.set(5, 5, 5); //change lights position

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

/*
//helper makes our lives easier with lights and shades
const lightHelper = new THREE.PointLightHelper(pointLight); //will show the direction of the light source
const gridHelper = new THREE.GridHelper(200, 50); //draws a 2 dimensionnal grid along the scene
scene.add(lightHelper, gridHelper);
*/


//let's make the scene more interactive by addind orbit controls
//const controls = new OrbitControls(camera, renderer.domElement);
//check mouse control and update the camera position accordingly



//we have our little space now, let's add stars to it !

function addStar() {
    
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(starGeometry, starMaterial);

    //randomly position stars
    const[x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
};

//number of stars in our space
Array(200).fill().forEach(addStar);

//cool huh! Let's now add a background to our space
const spaceTexture = texture.load('img/space.jpg');
scene.background = spaceTexture;


//we'll now create a texture for each object in our scene

//let's add myself !!!
const myTexture = texture.load('img/moi.jpg');

const me = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({map: myTexture})
);

scene.add(me);

//let's add a moon
const moonTexture = texture.load('img/moon.jpg');
const normalTexture = texture.load('img/normal.jpg');

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture
    })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

me.position.z = -5;
me.position.x = 2;

function moveCamera() {
    //calculate where the user is currently scrolled to
    const t = document.body.getBoundingClientRect().top;
    
    //rotate element everytime the user scrolls
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    me.rotation.y += 0.01;
    me.rotation.z += 0.01;

    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
    camera.position.z = t * -0.01;
};

document.body.onscroll = moveCamera;
moveCamera();

// to not call the render method each time, this method : renderer.render(scene, camera); , 
// we'll set up a recursive function
function animate() {
    requestAnimationFrame( animate );

    //let's make the torus rotate
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01; 

    //controls.update(); //to make sure that the changes are affected in the UI
    renderer.render(scene, camera);
};

animate();