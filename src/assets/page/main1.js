// 酷炫三角形
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

// 创建几何体
for (let i = 0; i < 50; i++) {
  // 每一个三角形需要三个顶点，每个顶点需要三个值
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random()*10 - 5;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

//   1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
// ]);

scene.add(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

//controls.update() must be called  after any manual changes to the camera's transform
camera.position.set(0, 10, 0);
controls.update();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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
