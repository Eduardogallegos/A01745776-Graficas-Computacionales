let renderer = null,
  scene = null,
  camera = null,
  cube = null,
  sphere = null,
  cone = null,
  sphereGroup = null,
  duration = 5000, // ms
  currentTime = Date.now(),
  generalGroup = new THREE.Object3D(),
  currentGroup = null,
  meshes = [],
  satelites_groups = [],
  textureUrl = "../images/ash_uvgrid01.jpg",
  texture = new THREE.TextureLoader().load(textureUrl),
  material = new THREE.MeshPhongMaterial({ map: texture }),
  geometryOptions = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.TorusGeometry(1, 0.5, 16, 50),
    new THREE.TorusKnotGeometry(0.5, 0.125, 100, 16),
    new THREE.CylinderGeometry(0, 0.333, 0.444, 20, 20),
  ];

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
  let fract = deltat / duration;
  let angle = Math.PI * 2 * fract;

  meshes.forEach((mesh) => {
    mesh.rotation.y += angle;
  });

  satelites_groups.forEach((satelite_group) => {
    satelite_group.rotation.y -= angle / 2;
  });
}

function run() {
  requestAnimationFrame(function () {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

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
  scene.add(generalGroup);
}

function getRandomCoords(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addElement() {
  let newGroup = new THREE.Object3D();

  let randomGeometryIndex = Math.floor(Math.random() * geometryOptions.length);

  let geometry = geometryOptions[randomGeometryIndex];

  // And put the geometry and material together into a mesh
  let mesh = new THREE.Mesh(geometry, material);

  // Tilt the mesh toward the viewer
  mesh.rotation.x = Math.PI / 5;
  mesh.rotation.y = Math.PI / 5;

  // Add the cube mesh to our group
  newGroup.add(mesh);
  meshes.push(mesh);
  newGroup.updateMatrixWorld();
  generalGroup.add(newGroup);
  newGroup.position.set(
    getRandomCoords(-4, 3),
    getRandomCoords(-3, 3),
    getRandomCoords(-15, 0)
  );
  currentGroup = newGroup;
}

function addSatelite() {
  let randomGeometryIndex = Math.floor(Math.random() * geometryOptions.length);

  let geometry = geometryOptions[randomGeometryIndex];

  // And put the geometry and material together into a mesh
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1, 1, -0.667);

  currentGroup.add(mesh);
  meshes.push(mesh);
  satelites_groups.push(currentGroup);
}

function resetCanvas() {
  generalGroup.children = [];
  currentGroup = null;
  meshes = [];
  satelites_groups = [];
}
