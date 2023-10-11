/**
 * Three.js 3D可视化示例。
 * 
 * 功能概述:
 * - 初始化3D场景、相机和渲染器。
 * - 使用OrbitControls实现场景旋转。
 * - 根据提供的纹理URL创建两组模拟星河效果的点云。
 * - 利用gsap动画库使两组点云实现持续的旋转动效。
 * - 定义并启动动画循环，实时渲染场景。
 * 
 * 注意：该文件同时展示了如何在场景中使用不同纹理的点云。
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
  40
);
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);

// scene.add(cube);
//controls.update() must be called  after any manual changes to the camera's transform
camera.position.set(0, 0, 40);
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

// 使用points设置随机顶点制作星河
function createPoints(url, size = 0.5) {
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
    vertexColors: true,
  });
  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);
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
  return points;
}

const points1 = createPoints("./img/snow.png");
const points2 = createPoints("./img/star.jpg");
// 设置时钟
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  points1.rotation.x = time * 0.3;
    points2.rotation.x = time * 0.3;
    points1.rotation.y = time * 0.05;
    points2.rotation.y = time * 0.05;

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
