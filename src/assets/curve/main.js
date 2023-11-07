import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


THREE.ColorManagement.enabled = true;

let camera, scene, renderer;

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

let moon;


const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 )
], true);

init();
animate();

function init() {
  const EARTH_RADIUS = 1;
  const MOON_RADIUS = 0.27;

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(5, 5, 5);
  camera.layers.enableAll();

  scene = new THREE.Scene();

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 0, 1);
  dirLight.layers.enableAll();
  scene.add(dirLight);

  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.layers.enableAll();
  scene.add(axesHelper);

  //

  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
  const earthMaterial = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load("./img/planets/earth_atmos_2048.jpg"),
    specularMap: textureLoader.load("./img/planets/earth_specular_2048.jpg"),
    normalMap: textureLoader.load("./img/planets/earth_normal_2048.jpg"),
    normalScale: new THREE.Vector2(0.85, 0.85),
  });
  earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  // 旋转180
  earth.rotation.y = Math.PI;
  scene.add(earth);

  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
  const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load("./img/planets/moon_1024.jpg"),
  });
  moonMaterial.map.colorSpace = THREE.SRGBColorSpace;
  moon = new THREE.Mesh(moonGeometry, moonMaterial);
  scene.add(moon);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 100;

  //

  window.addEventListener("resize", onWindowResize);
}


const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}



function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  const time = elapsed / 10 % 1;
  const point = curve.getPoint(time);

  moon.position.copy(point);
    camera.lookAt(moon.position);
  renderer.render(scene, camera);
}
