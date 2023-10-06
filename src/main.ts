import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';

const pane = new Pane();
const scene = new THREE.Scene();

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sunMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const earthMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
earth.position.x = 10;
scene.add(earth);

const moonMaterial = new THREE.MeshBasicMaterial({ color: 'grey' });
const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
moon.scale.setScalar(0.3);
moon.position.x = 2;
earth.add(moon);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.x = 50;

const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();