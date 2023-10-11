/**
 * 本文件是一个Three.js的3D可视化示例。
 * 
 * 功能概述:
 * - 初始化一个3D场景和相机。
 * - 使用OrbitControls允许场景的轻松旋转。
 * - 在场景中添加一个使用星星纹理的点云来模拟星河效果。
 * - 实现一个动画函数以持续渲染场景。
 * 
 * 注意：部分代码（例如光源、动画效果）已被注释掉，如需使用需要解除注释。
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
// console.log(THREE)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);

// scene.add(cube);
//controls.update() must be called  after any manual changes to the camera's transform
camera.position.set(0, 10, 0);
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

// 创建球几何体
const sphereGeometry = new THREE.SphereGeometry(3, 20, 20);

// const pointsMaterial = new THREE.PointsMaterial({
//   // 黄色
//   color: 0xffff00,
//   size: 0.05,
//   // 深度测试
//   depthWrite: false,
//   // 深度测试函数
//   depthTest: false,
//   blending: THREE.AdditiveBlending, // 使用加法混合
// });


// 创建点
// const points = new THREE.Points(sphereGeometry, pointsMaterial);
// scene.add(points);
// 使用points设置随机顶点制作星河
const pointsMaterial = new THREE.PointsMaterial({
  // 黄色
  color: 0xffff00,
  size: 0.5,
  // 深度测试
  depthWrite: false,
  // 深度测试函数
  depthTest: false,
  blending: THREE.AdditiveBlending, // 使用加法混合
  // 设置顶点颜色
  vertexColors: true
});
// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./img/star.jpg");
// 设置点材质全部使用同一个纹理
pointsMaterial.map = texture;
pointsMaterial.transparent = true;
pointsMaterial.alphaMap = texture;
const pointsGeometry = new THREE.BufferGeometry();
const count = 5000;

// 设置缓冲区数组
const vertices = new Float32Array(count * 3);

// 设置顶点颜色
const colors = new Float32Array(count * 3);

// 设置顶点
for (let i = 0; i < count * 3; i++) {
  vertices[i] = (Math.random() - 0.5) * 100;
  colors[i] = Math.random();
}


pointsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);
pointsGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);
const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

// // 创建球网格
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.y = 1;
// sphere.castShadow = true;
// scene.add(sphere);

// 创建点光源
// const pointLight = new THREE.PointLight(0xffffff, 1, 10);
// pointLight.position.set(0, 2, 0);
// pointLight.castShadow = true;
// scene.add(pointLight);

// 创建环境光
// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);

// gsap.to(cube.position, {
//   x: 5,
//   yoyo: true,
//   repeat: -1,
//   duration: 5
// });
// gsap.to(cube.position, {x:5, duration:5})

function animate() {
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
