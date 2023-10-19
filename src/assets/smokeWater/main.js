import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
// console.log(THREE)

// 导入water
import { Water } from "three/examples/jsm/objects/Water2.js";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景阴影贴图
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// 创建坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

// 创建一个平面
// const planeGeometry = new THREE.PlaneGeometry(1, 1, 512, 512);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// 加载场景背景
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./model/051.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

// 加载浴缸
const gltfLoader = new GLTFLoader();
gltfLoader.loadAsync("./model/yugang.glb").then((gltf) => {
  console.log(gltf);
  const yugang = gltf.scene.children[0];
  yugang.material.side = THREE.DoubleSide;

  const waterGeometry = gltf.scene.children[1].geometry;
  const water = new Water(waterGeometry, {
    color: "#ffffff",
    scale: 1,
    flowDirection: new THREE.Vector2(1, 1),
    textureWidth: 1024,
    textureHeight: 1024,
    side: THREE.DoubleSide,
  });
  // plane.receiveShadow = true;
  scene.add(water);

  scene.add(yugang);
});

// 增加直线光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.mapSize.set(4096, 4096);
scene.add(directionalLight);

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
