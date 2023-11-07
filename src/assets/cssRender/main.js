import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入CSS2DRenderer,CSS2DObject,
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

THREE.ColorManagement.enabled = true;

let camera, scene, renderer;

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

let moon;
let labelRenderer;
// 实例化射线
const raycaster = new THREE.Raycaster();
let chinaLabel;

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

  // 添加提示标签
  const earthLabelDiv = document.createElement("div");
  earthLabelDiv.className = "label";
  earthLabelDiv.innerHTML = "Earth";
  const earthLabel = new CSS2DObject(earthLabelDiv);
  earthLabel.position.set(0, EARTH_RADIUS + 0.5, 0);
  earth.add(earthLabel);

  // 实例化CSS2DRenderer
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(labelRenderer.domElement);
  labelRenderer.domElement.style.position = "fixed";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.left = "0";
  // 白色
  labelRenderer.domElement.style.color = "#fff";
  // labelRenderer.domElement.style.pointerEvents = "none"; // 禁用鼠标事件
  labelRenderer.domElement.style.zIndex = "10"; // 设置层级

  // 添加提示标签
  const moonLabelDiv = document.createElement("div");
  moonLabelDiv.className = "label";
  moonLabelDiv.innerHTML = "Moon";
  const moonLabel = new CSS2DObject(moonLabelDiv);
  moonLabel.position.set(0, MOON_RADIUS + 0.5, 0);
  moon.add(moonLabel);

  // 添加中国标签
  const chinaLabelDiv = document.createElement("div");
  chinaLabelDiv.className = "label1";
  chinaLabelDiv.innerHTML = "China";
  chinaLabel = new CSS2DObject(chinaLabelDiv);
  chinaLabel.position.set(-0.3, 0.5, -0.9);
  earth.add(chinaLabel);


  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, labelRenderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 100;

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}



function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);

  // 检测射线与对象的相交情况
  chinaLabel.position.project(camera);
  raycaster.setFromCamera(chinaLabel.position, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  console.log(intersects)
  if (intersects.length === 0) {
    chinaLabel.element.classList.add('visible')
  } else {
    chinaLabel.element.classList.remove('visible')
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
