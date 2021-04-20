class Planet{
    constructor(radius, parentGroup, material, moons, position){
        this.radius = radius;
        this.parentGroup = parentGroup;
        this.material = material
        this.group = new THREE.Object3D();
        this.geometry = new THREE.SphereGeometry( this.radius, 32, 32 );
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group.add(this.mesh);
        this.group.updateMatrixWorld();
        this.group.position.set(position.x, position.y, position.z);
        this.parentGroup.add(this.group);
    }
    draw(){

    }
    createMoons(){

    }
    createMaterial(){
        
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
  currentGroup = null,
  meshes = [],
  satellites_groups = [];

function main() {
  const canvas = document.getElementById("webglcanvas");

  // create the scene
  createScene(canvas);

  // Run the run loop
  run();
}

function animate() {
  // Calculate the angle of movement
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  let fract = deltat / DURATION;
  let angle = Math.PI * 2 * fract;

  // Rotate every object
  meshes.forEach((mesh) => {
    mesh.rotation.y += angle;
  });

  // Rotate every group that holds a satellite
  satellites_groups.forEach((satellite_group) => {
    satellite_group.rotation.y -= angle / 2;
  });
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
  scene.background = new THREE.Color(0.2, 0.2, 0.2);

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    1,
    4000
  );
  camera.position.z = 10;
  scene.add(camera);
  controls = new THREE.OrbitControls (camera, renderer.domElement);
  scene.add(controls);

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
}

function getRandomCoords(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addElement() {
  // Create a new 3D object for each element
  let newGroup = new THREE.Object3D();

  // Create random geometry
  let randomGeometryIndex = Math.floor(Math.random() * GEOMETRY_OPTIONS.length);
  let geometry = GEOMETRY_OPTIONS[randomGeometryIndex];

  // And put the geometry and material together into a mesh
  let mesh = new THREE.Mesh(geometry, MATERIAL);

  // Tilt the mesh toward the viewer
  mesh.rotation.x = Math.PI / 5;
  mesh.rotation.y = Math.PI / 5;

  // Add the cube mesh to our group and to the array of meshes
  newGroup.add(mesh);
  meshes.push(mesh);
  newGroup.updateMatrixWorld();

  // Add the group to the general group
  GENERAL_GROUP.add(newGroup);

  // Set the position of the group
  newGroup.position.set(
    getRandomCoords(-4, 3),
    getRandomCoords(-3, 3),
    getRandomCoords(-15, 0)
  );
  currentGroup = newGroup;
}

function addSatellite() {
  // Create random geometry
  let randomGeometryIndex = Math.floor(Math.random() * GEOMETRY_OPTIONS.length);
  let geometry = GEOMETRY_OPTIONS[randomGeometryIndex];

  // Put the geometry and material together into a mesh
  let mesh = new THREE.Mesh(geometry, MATERIAL);
  mesh.position.set(1, 1, -0.667);

  // Add the object to its "parent" group
  currentGroup.add(mesh);
  // Add object to meshes array to animate it
  meshes.push(mesh);
  // Add group to array of groups with satellites to animate
  satellites_groups.push(currentGroup);
}

function resetCanvas() {
  // reset everything to beginning values
  GENERAL_GROUP.children = [];
  currentGroup = null;
  meshes = [];
  satellites_groups = [];
}
