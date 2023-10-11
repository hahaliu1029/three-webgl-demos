/**
 * 使用Three.js和Cannon-es物理引擎的3D立方体交互示例。
 * 
 * 功能概述:
 * - 初始化3D场景、相机和渲染器。
 * - 通过点击事件动态创建立方体，并添加到3D场景中。
 * - 初始化Cannon-es物理世界，并为立方体和平面添加物理属性。
 * - 当立方体与其他物体发生碰撞时，根据碰撞强度播放击打声音。
 * - 添加环境光和平行光以实现真实感的光照效果。
 * - 使用OrbitControls实现场景旋转。
 * - 在动画循环中更新Cannon-es物理世界，并将物理属性同步到3D立方体上。
 * 
 * 注意：该文件主要展示如何使用Three.js与Cannon-es结合创建3D物理交互效果。
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
// 导入cannon引擎
import * as CANNON from "cannon-es";
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

// 创建击打声音
const hitSound = new Audio("./sound/hit.mp3");
// 创建立方体
const cubeArr = [];
const cubeMaterial = new THREE.MeshStandardMaterial();
// 创建材质
const cubeWorldMaterial = new CANNON.Material("default"); // 立方体材质
function createCube() {
  const cubegeometry = new THREE.BoxGeometry(1, 1, 1);

  const cube = new THREE.Mesh(cubegeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  const cubeBody = new CANNON.Body({
    mass: 1, // 质量
    position: new CANNON.Vec3(0, 0, 0),
    shape: cubeShape, // 形状
    material: cubeWorldMaterial, // 材质
  });

  cubeBody.applyLocalForce(
    new CANNON.Vec3(
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 100
    ),
    new CANNON.Vec3(0, 0, 0)
  ); // 施加力

  world.addBody(cubeBody);
  // 添加监听碰撞事件
  function handleCollide(e) {
    // 获取碰撞强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    console.log(impactStrength);
    // 如果碰撞强度大于1，播放声音
    if (impactStrength > 1.0) {
      hitSound.currentTime = 0;
      hitSound.volume = impactStrength/12; // 设置音量
      hitSound.play();
    }
  }
  cubeBody.addEventListener("collide", handleCollide);
  cubeArr.push({
    mesh: cube,
    body: cubeBody,
  });
}

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -5;
plane.receiveShadow = true;
scene.add(plane);

// 创建cannon世界
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // 重力
world.allowSleep = true; // 允许睡眠
// world.broadphase = new CANNON.SAPBroadphase(world); // 碰撞检测算法
// world.defaultContactMaterial.friction = 0; // 默认材质摩擦力
// world.defaultContactMaterial.restitution = 1; // 默认材质弹性系数

// 创建平面
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({
  mass: 0, // 质量 0表示静态物体
  position: new CANNON.Vec3(0, -5, 0),
  shape: planeShape, // 形状
});
planeBody.material = new CANNON.Material("floor");
// 旋转平面
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(planeBody);

// 设置材质碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWorldMaterial,
  planeBody.material,
  {
    friction: 0.5, // 摩擦力
    restitution: 0.7, // 弹性系数
  }
);

// 将材质碰撞参数添加到世界中
world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞默认材料
world.defaultContactMaterial = defaultContactMaterial;

// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
dirLight.position.set(0, 5, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = -2;
dirLight.shadow.camera.left = -2;
dirLight.shadow.camera.right = 2;
scene.add(dirLight);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
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

// 创建立方体
window.addEventListener("click", () => {
  createCube();
});

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  let deltaTime = clock.getDelta();
  // console.log(deltaTime)
  // 更新cannon世界
  world.step(1 / 60);

  // 更新球体位置
  // cube.position.copy(cubeBody.position);
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position); // 更新位置
    item.mesh.quaternion.copy(item.body.quaternion); // 更新旋转
  });
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}

animate();
