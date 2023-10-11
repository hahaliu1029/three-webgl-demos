// 引入 Three.js 和 Tween.js
import * as THREE from 'three';
import { Tween, Easing, autoPlay } from 'es6-tween';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建多个立方体
const cubes = [];
for (let i = 0; i < 10; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = (Math.random() - 0.5) * 10;
  cube.position.y = (Math.random() - 0.5) * 10;
  cube.position.z = (Math.random() - 0.5) * 10;
  scene.add(cube);
  cubes.push(cube);
}

// 创建动画
cubes.forEach((cube, index) => {
  new Tween(cube.rotation)
    .to({ x: Math.PI * 2, y: Math.PI * 2 }, 2000 + index * 500)
    .easing(Easing.Quadratic.Out)
    .repeat(Infinity)
    .start();
});

// 自动播放动画
autoPlay(true);

// 渲染循环
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// 响应窗口大小变化
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// 响应用户的鼠标移动事件
window.addEventListener('mousemove', function (event) {
  const mouseX = event.clientX / window.innerWidth * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  cubes.forEach((cube, index) => {
    new Tween(cube.position)
      .to({ x: mouseX * (index + 1), y: mouseY * (index + 1) }, 500)
      .easing(Easing.Quadratic.Out)
      .start();
  });
}, false);
