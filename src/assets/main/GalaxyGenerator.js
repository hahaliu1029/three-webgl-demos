/**
 * Three.js 3D银河生成示例。
 * 
 * 功能概述:
 * - 初始化3D场景、相机和渲染器。
 * - 使用OrbitControls实现场景旋转。
 * - 利用给定的参数和随机数生成一个类似于银河的3D点云结构。
 * - 设置点云材质并使用提供的纹理。
 * - 为点云设置颜色渐变效果。
 * - 定义并启动动画循环，实时渲染场景。
 * 
 * 注意：该文件主要展示如何使用Three.js创建一个银河结构。
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
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./img/star.jpg");

const params = {
  count: 5000,
  size: 0.1,
  radius: 5,
  branches: 6,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  // 随即生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const centerColor = new THREE.Color(params.color);
  const endColor = new THREE.Color(params.endColor);

  // 循环生成点
  for (let i = 0; i < params.count; i++) {
    // 当前的点应该在哪一条分支的角度上
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    // 当前点距离中心的距离
    const distanceFromCenter =
      Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3; // 当前顶点索引
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    positions[current] =
      Math.cos(branchAngle + distanceFromCenter * params.rotateScale) *
        distanceFromCenter +
      randomX; // 顶点x轴坐标
    positions[current + 1] = 0 + randomY; // 顶点y轴坐标
    positions[current + 2] =
      Math.sin(branchAngle + distanceFromCenter * params.rotateScale) *
        distanceFromCenter +
      randomZ; // 顶点z轴坐标

    // 混合颜色，形成渐变色
    const mixedColor = centerColor.clone();
    mixedColor.lerp(endColor, distanceFromCenter / params.radius);
    colors[current] = mixedColor.r;
    colors[current + 1] = mixedColor.g;
    colors[current + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // 设置顶点位置
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // 设置顶点颜色

  // 设置点材质
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true, // 设置顶点颜色
    // color: new THREE.Color(params.color),
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();
// 控制器改变时输出相机信息
controls.addEventListener("change", () => {
  console.log(camera);
});

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
