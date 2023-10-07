import * as THREE from 'three';

const planets = [
  {
    name: "Sun",
    radius: 5,
    distance: 0,
    speed: 0,
    textureFilePath: '/textures/2k_sun.jpg',
  },
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    textureFilePath: '/textures/2k_mercury.jpg',
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    textureFilePath: '/textures/2k_venus_surface.jpg',
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    textureFilePath: '/textures/2k_earth_daymap.jpg',
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
        textureFilePath: '/textures/2k_moon.jpg',
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    textureFilePath: '/textures/2k_mars.jpg',
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
        textureFilePath: '/textures/2k_moon.jpg',
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        textureFilePath: '/textures/2k_moon.jpg',
      },
    ],
  },
];

let planetMeshes: any[] = [];

export const initialize = () => {
  planetMeshes = planets.map(planet => createPlanetMesh(planet));
};

const createPlanetMesh = (planet: any) => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(planet.textureFilePath);
  const material = createMaterial(planet, texture);
  const planetMesh = new THREE.Mesh(geometry, material);

  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;

  if (planet.moons !== undefined) {
    planet.moons.forEach((moon: any) => {
      const moonMesh = createPlanetMesh(moon);
      planetMesh.add(moonMesh);
    });
  }

  return planetMesh;
};

const createMaterial = (planet: any, texture: THREE.Texture) => {
  if (planet.name === 'Sun')
    return new THREE.MeshBasicMaterial({ map: texture });
  else
    return new THREE.MeshStandardMaterial({ map: texture });
};

export const get = () => {
  return planetMeshes;
};

export const animate = () => {
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
