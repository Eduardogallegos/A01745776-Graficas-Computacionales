class Planet{
  constructor(radius, mapUrl, orbitRadius){
    this.radius = radius;
    this.parentGroup = GENERAL_GROUP;
    this.material = this.createMaterial(mapUrl);
    this.rotationGroup = new THREE.Object3D();
    this.moonsGroup = new THREE.Object3D();
    this.orbitRadius = orbitRadius;
    this.position = this.calculatePosition();
    this.moonsArray = [];
    this.drawOrbit();
    this.draw();
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

  drawOrbit(){
    this.orbit = new THREE.RingGeometry( this.orbitRadius - 1, this.orbitRadius + 1, 45 );
    this.orbit.rotateX(Math.PI/2);
    let orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
    let orbitMesh = new THREE.Mesh( this.orbit, orbitMaterial );
    GENERAL_GROUP.add(orbitMesh)
  }

  createMoons(moons){
    let moonGeometry = new THREE.SphereGeometry( 2, 32, 32 ),
    moonMaterial = this.createMaterial("../images/solar_system/moon/moonbump2k.jpg"),
    moonPositionOptions = [{x:8,y:5,z:8},{x:-8,y:-4,z:-8},{x:8,y:3,z:-8},{x:-8,y:1,z:8},{x:9,y:-5,z:-6}],
    posFactor = this.radius/10;

    for (let index = 0; index < moons; index++){
      let moonMesh = new THREE.Mesh(moonGeometry, moonMaterial)
      moonMesh.position.set(moonPositionOptions[index].x * posFactor,moonPositionOptions[index].y* posFactor,moonPositionOptions[index].z* posFactor)
      this.moonsGroup.add(moonMesh)
      this.moonsArray.push(moonMesh)
    }
  }  

  createMaterial = (url) => new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  getRandomCoords = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  calculatePosition = () => {
    let x = this.getRandomCoords(-this.orbitRadius, this.orbitRadius),
    y = this.getRandomCoords(-2,2),
    pos = Math.floor(Math.random()*2),
    coeficiente = Math.pow(this.orbitRadius,2) - Math.pow(x,2),
    z = undefined;
    if(pos === 1){
      z = Math.sqrt(coeficiente)
    }else{
      z = -Math.sqrt(coeficiente)
    }
    return {x:x,y:y,z:z};
  }

  addRing(){
    let ringGeometry = new THREE.TorusGeometry( this.radius + 5, 3, 16, 100 );
    ringGeometry.rotateX(Math.PI/2)
    let ringMaterial = new THREE.MeshBasicMaterial( { color: 0x420420 } );
    let ring = new THREE.Mesh( ringGeometry, ringMaterial );
    this.moonsGroup.add(ring)
  }

  animate(angle){
    this.mesh.rotation.y += angle;
    this.moonsArray.forEach(moonMesh => {
      moonMesh.rotation.y += angle;
    });
    this.moonsGroup.rotation.y -= angle/3;
  }
}

class Asteroid{
  constructor(radius, orbitRadius){
    this.radius = radius;
    this.parentGroup = ASTEROID_GROUP;
    this.material = this.createMaterial("../images/solar_system/asteroid/asteroid.jpg");
    this.rotationGroup = new THREE.Object3D();
    this.orbitRadius = orbitRadius;
    this.position = this.calculatePosition();
    this.draw();
  }

  draw(){
    this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.rotationGroup.add(this.mesh);
    this.rotationGroup.updateMatrixWorld();
    this.rotationGroup.position.set(this.position.x, this.position.y, this.position.z);
    this.rotationGroup.add(this.mesh)
    this.parentGroup.add(this.rotationGroup);
  }

  createMaterial = (url) => new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(url) });

  getRandomCoords = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  calculatePosition = () => {
    let x = this.getRandomCoords(-this.orbitRadius, this.orbitRadius),
    y = this.getRandomCoords(-2,2),
    pos = Math.floor(Math.random()*2),
    coeficiente = Math.pow(this.orbitRadius,2) - Math.pow(x,2),
    z = undefined;
    if(pos === 1){
      z = Math.sqrt(coeficiente)
    }else{
      z = -Math.sqrt(coeficiente)
    }
    return {x:x,y:y,z:z};
  }
}

// Global consts
const DURATION = 5000, // ms
  GENERAL_GROUP = new THREE.Object3D(),
  ASTEROID_GROUP = new THREE.Object3D()
  

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
  let angleFactor = Math.random()

  // GENERAL_GROUP.rotation.y += angle * angleFactor;
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
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance =200;
  controls.maxDistance = 700;

  controls.maxPolarAngle = Math.PI ;

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

  const sun = new Planet(30, sunMapUrl, 0)
  planets.push(sun)
  const mercury = new Planet(5, mercuryMapUrl, 40)
  planets.push(mercury)
  const venus = new Planet(6, venusMapUrl, 55)
  planets.push(venus)
  const earth = new Planet(10, earthMapUrl, 78) // 1
  earth.createMoons(1);
  planets.push(earth)
  const mars = new Planet(8, marsMapUrl, 105)
  planets.push(mars)
  createAsteroids();
  const jupiter = new Planet(17, jupiterMapUrl, 150) // 5
  jupiter.createMoons(5)
  planets.push(jupiter)
  const saturn = new Planet(12, saturnMapUrl, 190)
  saturn.addRing();
  planets.push(saturn)
  const uranus = new Planet(10, uranusMapUrl, 218)
  planets.push(uranus)
  const neptune = new Planet(11, neptuneMapUrl, 245)
  planets.push(neptune)
  const pluto = new Planet(5, plutoMapUrl, 270)
  planets.push(pluto)
}

function createAsteroids(){
  for (let j = 0; j < 50; j++) {
    new Asteroid(2, 115);
    new Asteroid(2, 130);
    let orbit = new THREE.RingGeometry( 119, 121, 45 );
    orbit.rotateX(Math.PI/2);
    let orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
    let orbitMesh = new THREE.Mesh( orbit, orbitMaterial );
    GENERAL_GROUP.add(ASTEROID_GROUP);
    GENERAL_GROUP.add(orbitMesh)
  }
}