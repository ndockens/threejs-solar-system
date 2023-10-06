import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('/textures/cubeMap/');

const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");

const backgroundCubeMap = cubeTextureLoader.load(
  [
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png'
  ]);

scene.background = backgroundCubeMap;

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        material: moonMaterial,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        material: moonMaterial,
      },
    ],
  },
];

let planetMeshes: any[] = [];

const createPlanets = () => {
  planetMeshes = planets.map(planet => createPlanet(planet));
};

const createPlanet = (planet: any) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;

  if (planet.moons !== undefined) {
    planet.moons.forEach((moon: any) => {
      const moonMesh = createPlanet(moon);
      planetMesh.add(moonMesh);
    });
  }

  return planetMesh;
};

const addPlanetsToScene = () => {
  planetMeshes.forEach(planetMesh => scene.add(planetMesh));
};

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(pointLight);

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const renderloop = () => {

  planetMeshes.forEach((planetMesh, planetIndex) => {
    const planet = planets[planetIndex];
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

createPlanets();
addPlanetsToScene();
renderloop();