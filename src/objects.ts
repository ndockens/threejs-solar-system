import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load("/textures/2k_sun.jpg");
const mercuryTexture = textureLoader.load("/textures/2k_mercury.jpg");
const venusTexture = textureLoader.load("/textures/2k_venus_surface.jpg");
const earthTexture = textureLoader.load("/textures/2k_earth_daymap.jpg");
const marsTexture = textureLoader.load("/textures/2k_mars.jpg");
const moonTexture = textureLoader.load("/textures/2k_moon.jpg");

const planets = [
  {
    name: "Sun",
    radius: 5,
    distance: 0,
    speed: 0,
    material: new THREE.MeshBasicMaterial({ map: sunTexture }),
    moons: [],
  },
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: new THREE.MeshStandardMaterial({ map: mercuryTexture }),
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: new THREE.MeshStandardMaterial({ map: venusTexture }),
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: new THREE.MeshStandardMaterial({ map: earthTexture }),
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
        material: new THREE.MeshStandardMaterial({ map: moonTexture }),
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: new THREE.MeshStandardMaterial({ map: marsTexture }),
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        material: new THREE.MeshStandardMaterial({ map: moonTexture }),
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        material: new THREE.MeshStandardMaterial({ map: moonTexture }),
      },
    ],
  },
];

let planetMeshes: any[] = [];

const createPlanets = () => {
  planetMeshes = planets.map(planet => createPlanet(planet));
  return planetMeshes;
};

const createPlanet = (planet: any) => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const planetMesh = new THREE.Mesh(geometry, planet.material);
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

const animateAll = () => {
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
};

export { planets, createPlanets, animateAll };