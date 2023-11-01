/**
 * 
 * 文件主要目的：
 * - 本文件主要是为了展示如何通过Three.js创建一个带有动画效果的绿色平面。
 * 
 * 用户可以通过鼠标和键盘与这个3D平面进行互动，平面会随着时间的推移而产生动画效果。
 * 
 * 功能和组件概述：
 * - 初始化Three.js场景、相机、渲染器。
 * - 添加可交互性（OrbitControls）。
 * - 使用GLSL着色器实现平面的动态效果。
 * - 用时钟对象来动态更新平面的位置。
 * 
 * 依赖项:
 * - Three.js
 * - gsap (GreenSock Animation Platform)
 * - OrbitControls (Three.js的一个控制器)
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

// 创建绿色平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});

const basicUniform = {
  u_time: { value: 0 },
};

planeMaterial.onBeforeCompile = (shader, renderer) => {
  shader.uniforms.u_time = basicUniform.u_time;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    uniform float u_time;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    transformed.x += sin(u_time) * 2.0;
    transformed.z += cos(u_time) * 2.0;
    `
  );
};
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// 设置时钟
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  basicUniform.u_time.value = time;

  renderer.render(scene, camera);
}

animate();
