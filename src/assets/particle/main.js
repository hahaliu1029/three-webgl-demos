import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import basicVertexShader from "./shader/vertex.glsl";
import basicFragmentShader from "./shader/fragment.glsl";
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
const particlesTexture = textureLoader.load("./img/snow.png");
const particlesTexture1 = textureLoader.load("./img/star.jpg");
const particlesTexture2 = textureLoader.load("./img/heart.png");

const params = {
  count: 1000,
  size: 0.1,
  radius: 5,
  branches: 4,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;
const generateGalaxy = () => {
  // 移除上一次的顶点
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  // 随即生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const centerColor = new THREE.Color(params.color);
  const endColor = new THREE.Color(params.endColor);

  const scales = new Float32Array(params.count);

  // 图案属性
  const imgIndex = new Float32Array(params.count);

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

    // 设置缩放
    scales[i] = Math.random();
    console.log(scales)
    // 根据索引生成图案
    imgIndex[current] = i % 3;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // 设置顶点位置
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // 设置顶点颜色
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1)); // 设置顶点缩放
  geometry.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1)); // 设置顶点缩放

  // 设置点材质
 const material = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: particlesTexture },
    uTexture1: { value: particlesTexture1 },
    uTexture2: { value: particlesTexture2 },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(colors) },
  },
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending, // 混合模式
  depthWrite: false, // 关闭深度写入
  vertexColors: true, // 开启顶点颜色
});
  points = new THREE.Points(geometry, material);
  points.rotation.x = -Math.PI/2;
  scene.add(points);
};

generateGalaxy();

// const geometry = new THREE.BufferGeometry();
// const positions = new Float32Array([0, 0, 0]);
// geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // 设置顶点位置

// // 点材质
// // const material = new THREE.PointsMaterial({
// //   // 红色
// //     color: 0xff0000,
// //     size: 10,
// //     sizeAttenuation: true, // 粒子大小是否和距离有关
// // });

// // 点着色器材质
// const material = new THREE.ShaderMaterial({
//   uniforms: {
//     uTexture: { value: particlesTexture },
//   },
//   vertexShader: basicVertexShader,
//   fragmentShader: basicFragmentShader,
//   transparent: true,
// });

// // 生成点
// const points = new THREE.Points(geometry, material);
// scene.add(points);

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  // 更新着色器中的时间
  points.material.uniforms.uTime.value = time;

  renderer.render(scene, camera);
}

animate();
