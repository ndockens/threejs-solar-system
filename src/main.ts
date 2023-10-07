import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Background from './background';
import { camera } from './camera';
import * as Lights from './lights';
import * as PlanetaryObjects from './objects';

const scene = new THREE.Scene();

scene.background = Background.backgroundCubeMap;

scene.add(PlanetaryObjects.sun);

let planets = PlanetaryObjects.createPlanets();
scene.add(...planets);

scene.add(Lights.ambientLight);
scene.add(Lights.pointLight);

camera.position.z = 100;
camera.position.y = 5;
scene.add(camera);

const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const addWindowResizeListener = () => {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });  
};

const renderloop = () => {
  PlanetaryObjects.animatePlanets();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

addWindowResizeListener();
renderloop();