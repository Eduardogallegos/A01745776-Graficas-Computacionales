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
  textureUrl = "../images/ash_uvgrid01.jpg",
  texture = new THREE.TextureLoader().load(textureUrl),
  material = new THREE.MeshPhongMaterial({ map: texture }),
  geometryOptions = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.RingGeometry(0.5, 1, 32),
    new THREE.TorusGeometry(1, 0.5, 16, 50),
    new THREE.TorusKnotGeometry(0.5, 0.125, 100, 16),
    new THREE.CylinderGeometry(0, 0.333, 0.444, 20, 20)
  ];

function main() {
  const canvas = document.getElementById("webglcanvas");

  // create the scene
  createScene(canvas);

  // Run the run loop
  run();
}

// Rotation has to be set when creating
// function rotate (mesh){
//   let now = Date.now();
//   let deltat = now - currentTime;
//   currentTime = now;
//   let fract = deltat / duration;
//   let angle = Math.PI * 2 * fract;
//   let boolean = Math.floor(Math.random() * 2);
//   let axes = [x,y,z];
//   let rotationAxis = Math.floor(Math.random() * axes.length);
//   if(boolean){
//     mesh.rotation.rotationAxis
//   }
// }

function animate() {
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  let fract = deltat / duration;
  let angle = Math.PI * 2 * fract;

  // Rotate the cube about its Y axis
  cube.rotation.y += angle;

  // Rotate the sphere group about its Y axis
  sphereGroup.rotation.y -= angle / 2;
  sphere.rotation.x += angle;

  // Rotate the cone about its X axis (tumble forward)
  cone.rotation.z += angle;
}

function run() {
  requestAnimationFrame(function () {
    run();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  //   animate();
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

  //   // Create the cube geometry
  //   let geometry = new THREE.BoxGeometry(2, 2, 2);

  //   // And put the geometry and material together into a mesh
  //   cube = new THREE.Mesh(geometry, material);

  //   // Tilt the mesh toward the viewer
  //   cube.rotation.x = Math.PI / 5;
  //   cube.rotation.y = Math.PI / 5;

  //   // Add the cube mesh to our group
  //   cubeGroup.add(cube);

  //   cubeGroup.position.set(1, 0, -0.5);

  //   console.log("cube position:", cube);

  //   // Create a group for the sphere
  //   sphereGroup = new THREE.Object3D();
  //   cubeGroup.add(sphereGroup);

  //   // Move the sphere group up and back from the cube
  //   sphereGroup.position.set(0, 3, -4);

  //   // Create the sphere geometry
  //   geometry = new THREE.SphereGeometry(1, 20, 20);

  //   // And put the geometry and material together into a mesh
  //   sphere = new THREE.Mesh(geometry, material);

  //   // Add the sphere mesh to our group
  //   sphereGroup.add(sphere);

  //   // Create the cone geometry
  //   geometry = new THREE.CylinderGeometry(0, 0.333, 0.444, 20, 20);

  //   // And put the geometry and material together into a mesh
  //   cone = new THREE.Mesh(geometry, material);

  //   // Move the cone up and out from the sphere
  //   cone.position.set(1, 1, -0.667);

  //   // Add the cone mesh to our group
  //   sphereGroup.add(cone);

  // Now add the group to our scene
  scene.add(generalGroup);

  // This code gets the world position of the cone.
  //   let coneWorldPosition = new THREE.Vector3();

  //   cubeGroup.updateMatrixWorld();
  //   sphereGroup.updateMatrixWorld();
  //   cone.updateMatrixWorld();

  //   console.log(cone.position);
  //   cone.getWorldPosition(coneWorldPosition);
  //   console.log(coneWorldPosition);
}

function getRandomCoords(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addElement() {
  console.log(currentGroup);

  let newGroup = new THREE.Object3D();

  let randomGeometryIndex = Math.floor(Math.random()*geometryOptions.length)

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
  console.log(generalGroup);
  console.log(currentGroup);
}

function addSatelite(){
  let randomGeometryIndex = Math.floor(Math.random()*geometryOptions.length)

  let geometry = geometryOptions[randomGeometryIndex];

  // And put the geometry and material together into a mesh
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(1, 1, -0.667);

  currentGroup.add(mesh);
}

function resetCanvas() {
  console.log("canvas reset");
  generalGroup.clear();
  currentGroup = null;
  meshes = [];
}
