/**
 * 使用Three.js和dat.GUI库实现的动画效果示例，基于自定义GLSL着色器和用户界面。(适用水波纹和烟雾)
 * 
 * 功能概述:
 * - 初始化Three.js的基础组件，如场景、摄像机、渲染器等。
 * - 导入自定义的GLSL顶点和片元着色器。
 * - 使用dat.GUI创建一个简单的用户界面，以实时调整各种参数。
 * - 设置纹理贴图和光照。
 * - 使用ShaderMaterial应用自定义着色器。
 * - 创建一个平面几何体并应用着色器材质，以展示动画效果。
 * - 通过一个动画循环，实时更新着色器中的时间uniform，从而在材质上创建动画效果。
 * 
 * 注意：该文件展示了如何结合Three.js, GLSL和dat.GUI来实现基于着色器和用户界面的动画效果。
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
// console.log(THREE)

// 倒入顶点着色器
import basicVertexShader from "./shaders/vertex.glsl";
// 倒入片元着色器
import basicFragmentShader from "./shaders/fragment.glsl";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.add(camera);

//使用dat.gui
const gui = new dat.GUI();

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

const params = {
  uWaresFrequency: 14,
  uScale: 0.04,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uTime: 0,
  uLowColor: "#ff0000",
  uHighColor: "#ffff00",
  uXspeed: 1,
  uZspeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
};

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: params.uTime },
    uWaresFrequency: { value: params.uWaresFrequency },
    uScale: { value: params.uScale },
    uXzScale: { value: params.uXzScale },
    uNoiseFrequency: { value: params.uNoiseFrequency },
    uNoiseScale: { value: params.uNoiseScale },
    uLowColor: { value: new THREE.Color(params.uLowColor) },
    uHighColor: { value: new THREE.Color(params.uHighColor) },
    uXspeed: { value: params.uXspeed },
    uZspeed: { value: params.uZspeed },
    uNoiseSpeed: { value: params.uNoiseSpeed },
    uOpacity: { value: params.uOpacity },
  },
  transparent: true,
});

gui
  .add(params, "uWaresFrequency")
  .min(0)
  .max(100)
  .step(0.1)
  .onChange(() => {
    shaderMaterial.uniforms.uWaresFrequency.value = params.uWaresFrequency;
  });
gui
  .add(params, "uScale", 0, 1)
  .step(0.001)
  .onChange(() => {
    shaderMaterial.uniforms.uScale.value = params.uScale;
  });

gui
  .add(params, "uXzScale", 0, 5)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uXzScale.value = params.uXzScale;
  });

gui
  .add(params, "uNoiseFrequency", 0, 100)
  .step(0.1)
  .onChange(() => {
    shaderMaterial.uniforms.uNoiseFrequency.value = params.uNoiseFrequency;
  });

gui
  .add(params, "uNoiseScale", 0, 5)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uNoiseScale.value = params.uNoiseScale;
  });

gui
  .addColor(params, "uLowColor")
  .onFinishChange((value) => {
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
  }
);

gui
  .addColor(params, "uHighColor")
  .onFinishChange((value) => {
    shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
  }
);

gui
  .add(params, "uXspeed", 0, 5)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uXspeed.value = params.uXspeed;
  });

gui
  .add(params, "uZspeed", 0, 5)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uZspeed.value = params.uZspeed;
  });

gui
  .add(params, "uNoiseSpeed", 0, 5)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uNoiseSpeed.value = params.uNoiseSpeed;
  });

gui
  .add(params, "uOpacity", 0, 1)
  .step(0.01)
  .onChange(() => {
    shaderMaterial.uniforms.uOpacity.value = params.uOpacity;
  });

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 512, 512);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  shaderMaterial.uniforms.uTime.value = time;

  renderer.render(scene, camera);
}

animate();
