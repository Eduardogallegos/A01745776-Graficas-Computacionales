class Planet{
  constructor(radius, mapUrl, moons_number, position){
    this.radius = radius;
    this.parentGroup = GENERAL_GROUP;
    this.material = this.createMaterial(mapUrl);
    this.rotationGroup = new THREE.Object3D();
    this.moonsGroup = new THREE.Object3D();
    this.position = position;

    this.draw();
    for (let i = 0; i < moons_number; i++) {
      this.createMoon();
    }
    
  }

  draw(){
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.rotationGroup.add(this.mesh);
    this.rotationGroup.updateMatrixWorld();
    this.rotationGroup.position.set(this.position.x, this.position.y, this.position.z);
    this.moonsGroup.add(this.mesh)
    this.parentGroup.add(this.rotationGroup);
    this.rotationGroup.add(this.moonsGroup);
  }

  createMoon(){
    let moonGeometry = new THREE.SphereGeometry( 2, 32, 32 ),
    moonMaterial = this.createMaterial("../images/solar_system/moon/moonbump2k.jpg"),
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(this.getRandomCoords(8,20),this.getRandomCoords(-5,5),this.getRandomCoords(8,20))
    this.moonsGroup.add(moonMesh)
  }

  getRandomCoords = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  

  createMaterial = (url) => new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  animate(angle){
    this.mesh.rotation.y += angle;
    this.moonsGroup.rotation.y -= angle/3;
  }
}

class Sun{
  constructor(radius, mapUrl, position){
    this.radius = radius;
    this.parentGroup = GENERAL_GROUP;
    this.material = this.createMaterial(mapUrl);
    this.rotationGroup = new THREE.Object3D();
    this.moonsGroup = new THREE.Object3D();
    this.position = position;

    this.draw();
    for (let i = 0; i < moons_number; i++) {
      this.createMoon();
    }
    
  }

  draw(){
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.rotationGroup.add(this.mesh);
    this.rotationGroup.updateMatrixWorld();
    this.rotationGroup.position.set(this.position.x, this.position.y, this.position.z);
    this.parentGroup.add(this.rotationGroup);
  }

  createMoon(){
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
  }

  createMaterial = (url) => new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  animate(){
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / DURATION;
    let angle = Math.PI * 2 * fract;

    this.mesh.rotation.y += angle;
  }
}

// Global consts
const DURATION = 5000, // ms
  TEXTURE_URL = "../images/ash_uvgrid01.jpg",
  TEXTURE = new THREE.TextureLoader().load(TEXTURE_URL),
  MATERIAL = new THREE.MeshPhongMaterial({ map: TEXTURE }),
  GENERAL_GROUP = new THREE.Object3D(),
  GEOMETRY_OPTIONS = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.TorusGeometry(1, 0.5, 16, 50),
    new THREE.TorusKnotGeometry(0.5, 0.125, 100, 16),
    new THREE.CylinderGeometry(0, 0.333, 0.444, 20, 20),
  ];

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

  // Rotate every group that holds a satellite
  // satellites_groups.forEach((satellite_group) => {
  //   satellite_group.rotation.y -= angle / 2;
  // });
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
  camera.position.z = 10;
  scene.add(camera);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

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

  // Crear Sol
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

  const sun = new Planet(30, sunMapUrl, 0, {x:0, y:0, z:0})
  planets.push(sun)
  const mercury = new Planet(5, mercuryMapUrl, 0, {x:30, y:-1, z:1})
  planets.push(mercury)
  const venus = new Planet(6, venusMapUrl, 0, {x:40, y:2, z:2})
  planets.push(venus)
  const earth = new Planet(9, earthMapUrl, 1, {x:55, y:0, z:3})
  planets.push(earth)
  const mars = new Planet(8, marsMapUrl, 0, {x:70, y:0, z:3})
  planets.push(mars)
  const jupiter = new Planet(17, jupiterMapUrl, 5, {x:110, y:0, z:3})
  planets.push(jupiter)
  const saturn = new Planet(12, saturnMapUrl, 0, {x:140, y:0, z:3})
  planets.push(saturn)
  const uranus = new Planet(10, uranusMapUrl, 0, {x:160, y:0, z:3})
  planets.push(uranus)
  const neptune = new Planet(11, neptuneMapUrl, 0, {x:175, y:0, z:3})
  planets.push(neptune)
  const pluto = new Planet(5, plutoMapUrl, 0, {x:200, y:0, z:3})
  planets.push(pluto)
}