/**
 * Three.js 3D立方体交互示例。
 * 
 * 功能概述:
 * - 初始化3D场景、相机和渲染器。
 * - 创建1000个线框模式的绿色立方体，排列在3D空间中。
 * - 使用OrbitControls实现场景旋转。
 * - 监听鼠标移动，当鼠标指向某个立方体时，使用Raycaster改变其颜色为红色。
 * - 定义并启动动画循环，实时渲染场景。
 * 
 * 注意：该文件主要展示如何使用Three.js实现3D立方体的交互效果。
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
// 创建1000个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff00,
    wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

let cubeArr = [];
for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5; j++) {
        for (let z = -5; z < 5; z++) {
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(i, j, z);
            scene.add(cube);
            cubeArr.push(cube);
        }
    }
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 监听鼠标位置
const mouse = new THREE.Vector2();
document.addEventListener("mousemove", (event) => {
    // 计算鼠标位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.intersectObjects(cubeArr).forEach((item) => {
        item.object.material = redMaterial;
    });
});

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

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
