import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Background from './background';
import { camera } from './camera';
import * as Lights from './lights';
import * as PlanetaryObjects from './objects';

const scene = new THREE.Scene();

scene.background = Background.backgroundCubeMap;

scene.add(PlanetaryObjects.sun);

let planetMeshes = PlanetaryObjects.createPlanets();
scene.add(...planetMeshes);

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

  planetMeshes.forEach((planetMesh, planetIndex) => {
    const planet = PlanetaryObjects.planets[planetIndex];
    planetMesh.rotation.y += planet.speed;
    planetMesh.position.x = Math.sin(planetMesh.rotation.y) * planet.distance;
    planetMesh.position.z = Math.cos(planetMesh.rotation.y) * planet.distance;

    planetMesh.children.forEach((moonMesh: any, moonIndex: any) => {
      const moon = planet.moons?.[moonIndex];

      if (moon !== undefined) {
        moonMesh.rotation.y += moon.speed;
        moonMesh.position.x = Math.sin(moonMesh.rotation.y) * moon.distance;
        moonMesh.position.z = Math.cos(moonMesh.rotation.y) * moon.distance;
      }
    });
  });

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

addWindowResizeListener();
renderloop();