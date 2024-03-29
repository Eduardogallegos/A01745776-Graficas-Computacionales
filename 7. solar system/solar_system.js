class Planet {
  /**
   *
   * @param {int} radius
   * @param {string} mapUrl
   * @param {int} orbitRadius
   */
  constructor(radius, mapUrl, orbitRadius) {
    this.radius = radius;
    this.parentGroup = GENERAL_GROUP;
    this.material = this.createMaterial(mapUrl);
    this.rotationGroup = new THREE.Object3D(); // Grupo para manejar la traslacion
    this.moonsGroup = new THREE.Object3D(); // Grupo para rotacion y lunas
    this.orbitRadius = orbitRadius;
    this.position = this.calculatePosition(); // Posicion calculada con respecto a su orbita
    this.moonsArray = []; // Arreglo para guardar las lunas del planeta y animarlas
    this.drawOrbit();
    this.draw();
  }

  draw() {
    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.rotationGroup.updateMatrixWorld();
    this.moonsGroup.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.moonsGroup.add(this.mesh);
    this.rotationGroup.add(this.moonsGroup);
    this.parentGroup.add(this.rotationGroup);
  }

  drawOrbit() {
    this.orbit = new THREE.RingGeometry(
      this.orbitRadius - 1,
      this.orbitRadius + 1,
      45
    ); // Orbita en forma de anillo
    this.orbit.rotateX(Math.PI / 2); // Rotacion a 90° para quedar en el plano XZ
    let orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    let orbitMesh = new THREE.Mesh(this.orbit, orbitMaterial);
    GENERAL_GROUP.add(orbitMesh);
  }

  createMoons(moons, moonRadius) {
    let moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32),
      moonMaterial = this.createMaterial(
        "../images/solar_system/moon/moonbump2k.jpg"
      ),
      moonPositionOptions = [
        { x: 8, y: 5, z: 8 },
        { x: -8, y: -4, z: -8 },
        { x: 8, y: 3, z: -8 },
        { x: -8, y: 1, z: 8 },
        { x: 9, y: -5, z: -6 },
      ], // Posiciones arbitrarias para las lunas
      posFactor = this.radius / 10; // Operacion para evitar que las lunas choquen con sus planetas

    for (let index = 0; index < moons; index++) {
      let moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
      moonMesh.position.set(
        moonPositionOptions[index].x * posFactor,
        moonPositionOptions[index].y * posFactor,
        moonPositionOptions[index].z * posFactor
      );
      this.moonsGroup.add(moonMesh);
      this.moonsArray.push(moonMesh);
    }
  }

  createMaterial = (url) =>
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  getRandomCoords = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  calculatePosition = () => {
    /*
     *  La posicion inicial del planeta se calcula de forma aleatoria,
     *  dentro de la trayectoria de su orbita respecto al sol
     */
    let x = this.getRandomCoords(-this.orbitRadius, this.orbitRadius),
      y = this.getRandomCoords(-2, 2),
      pos = Math.floor(Math.random() * 2),
      coeficiente = Math.pow(this.orbitRadius, 2) - Math.pow(x, 2),
      z = undefined;
    if (pos === 1) {
      z = Math.sqrt(coeficiente);
    } else {
      z = -Math.sqrt(coeficiente);
    }
    return { x: x, y: y, z: z };
  };

  addRing() {
    /**
     * Metodo para agregar anillos a los planetas (Saturno)
     */
    let ringGeometry = new THREE.TorusGeometry(this.radius + 5, 3, 16, 100);
    ringGeometry.rotateX(Math.PI / 2);
    let ringMaterial = new THREE.MeshBasicMaterial({ color: 0x420420 });
    let ring = new THREE.Mesh(ringGeometry, ringMaterial);
    this.moonsGroup.add(ring);
  }

  animate(angle) {
    /**
     * Metodo para animar al plantea (rotacion) y sus lunas (rotacion y traslacion)
     */
    this.mesh.rotation.y += angle;
    this.moonsArray.forEach((moonMesh) => {
      moonMesh.rotation.y += angle;
    });
    this.moonsGroup.rotation.y -= angle / 3;
  }
}

class Asteroid {
  /**
   *
   * @param {int} radius
   * @param {int} orbitRadius
   */
  constructor(radius, orbitRadius) {
    this.radius = radius;
    this.parentGroup = ASTEROID_GROUP;
    this.material = this.createMaterial(
      "../images/solar_system/asteroid/asteroid.jpg"
    );
    this.rotationGroup = new THREE.Object3D();
    this.orbitRadius = orbitRadius;
    this.position = this.calculatePosition();
    this.draw();
  }

  draw() {
    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.rotationGroup.updateMatrixWorld();
    this.rotationGroup.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.rotationGroup.add(this.mesh);
    this.parentGroup.add(this.rotationGroup);
  }

  createMaterial = (url) =>
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  getRandomCoords = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  calculatePosition = () => {
    /*
     *  La posicion inicial del asteroide se calcula de forma aleatoria,
     *  dentro de la trayectoria de su orbita respecto al sol
     */
    let x = this.getRandomCoords(-this.orbitRadius, this.orbitRadius),
      y = this.getRandomCoords(-2, 2),
      pos = Math.floor(Math.random() * 2),
      coeficiente = Math.pow(this.orbitRadius, 2) - Math.pow(x, 2),
      z = undefined;
    if (pos === 1) {
      z = Math.sqrt(coeficiente);
    } else {
      z = -Math.sqrt(coeficiente);
    }
    return { x: x, y: y, z: z };
  };
}

// Global consts
const DURATION = 5000, // ms
  GENERAL_GROUP = new THREE.Object3D(),
  ASTEROID_GROUP = new THREE.Object3D();

// Global vars
let renderer = null,
  scene = null,
  camera = null,
  controls = null,
  currentTime = Date.now(),
  planets = [];

function main() {
  const canvas = document.getElementById("webglcanvas");

  // create the scene
  createScene(canvas);

  // Run the run loop
  run();
}

function animate() {
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  let fract = deltat / DURATION;
  let angle = Math.PI * 2 * fract;
  // Rotate every object
  planets.forEach((planet) => {
    planet.animate(angle);
  });
  let rotationGroups = GENERAL_GROUP.children, // Grupos a trasladar
    slowing_rate = 1, // Variable para variar la velocidad de rotacion entre planetas
    rotationGroups2 = rotationGroups.filter(checkObjects); // filtrar entre elementos a trasladar
  rotationGroups2.forEach((group) => {
    group.rotation.y += angle / slowing_rate;
    slowing_rate += 2;
  });
}

function checkObjects(obj) {
  return obj.type === "Object3D";
}

function run() {
  requestAnimationFrame(function () {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);
  controls.update();

  // Spin the cube for next frame
  animate();
}

function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background color
  // scene.background = new THREE.Color(0.2, 0.2, 0.2);

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.z = 40;
  scene.add(camera);

  // Herramienta para controlar la escena con ayuda del mouse
  controls = new THREE.OrbitControls(camera, renderer.domElement); 
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 150;
  controls.maxDistance = 700;
  controls.maxPolarAngle = Math.PI; // 180° como rotacion maxima

  // Add a directional light to show off the objects
  let light = new THREE.DirectionalLight(0xffffff, 1.0);

  // Position the light out from the scene, pointing at the origin
  light.position.set(-0.5, 0.2, 1);
  light.target.position.set(0, -2, 0);
  scene.add(light);

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
  scene.add(ambientLight);

  // Now add the group to our scene
  scene.add(GENERAL_GROUP);

  // Ruta a las texturas de los planteas
  let sunMapUrl = "../images/solar_system/sun/sun.jpg",
    mercuryMapUrl = "../images/solar_system/mercury/mercurymap.jpg",
    venusMapUrl = "../images/solar_system/venus/venusmap.jpg",
    earthMapUrl = "../images/solar_system/earth/earthmap1k.jpg",
    marsMapUrl = "../images/solar_system/mars/mars_1k_color.jpg",
    jupiterMapUrl = "../images/solar_system/jupiter/jupitermap.jpg",
    saturnMapUrl = "../images/solar_system/saturn/saturnmap.jpg",
    uranusMapUrl = "../images/solar_system/uranus/uranusmap.jpg",
    neptuneMapUrl = "../images/solar_system/neptune/neptunemap.jpg",
    plutoMapUrl = "../images/solar_system/pluto/plutomap2k.jpg";

  // Construccion de los planetas
  const sun = new Planet(30, sunMapUrl, 0);
  const mercury = new Planet(5, mercuryMapUrl, 40);
  planets.push(mercury);
  const venus = new Planet(6, venusMapUrl, 55);
  planets.push(venus);
  const earth = new Planet(10, earthMapUrl, 78);
  earth.createMoons(1, 3); // Creacion de 1 luna para la tierra
  planets.push(earth);
  const mars = new Planet(8, marsMapUrl, 105);
  planets.push(mars);
  createAsteroids(); // Creacion del cinturon de asteroides
  const jupiter = new Planet(17, jupiterMapUrl, 150);
  jupiter.createMoons(5, 2); // Creacion de 5 lunas para Jupiter
  planets.push(jupiter);
  const saturn = new Planet(12, saturnMapUrl, 190);
  saturn.addRing(); // Creacion del anillo de Saturno
  planets.push(saturn);
  const uranus = new Planet(10, uranusMapUrl, 218);
  planets.push(uranus);
  const neptune = new Planet(11, neptuneMapUrl, 245);
  planets.push(neptune);
  const pluto = new Planet(5, plutoMapUrl, 270);
  planets.push(pluto);
}

function createAsteroids() {
  for (let j = 0; j < 50; j++) {
    // Se manejan dos distancias entre los asteoides y el sol
    new Asteroid(2, 115); 
    new Asteroid(2, 130);
    let orbit = new THREE.RingGeometry(119, 121, 45); // Orbita del cinturon de asteroides
    orbit.rotateX(Math.PI / 2);
    let orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    let orbitMesh = new THREE.Mesh(orbit, orbitMaterial);
    GENERAL_GROUP.add(ASTEROID_GROUP);
    GENERAL_GROUP.add(orbitMesh);
  }
}
