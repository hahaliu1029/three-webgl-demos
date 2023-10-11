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

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv; // uv 表示顶点的纹理坐标 0,0 表示左下角 1,1 表示右上角 0.5,0.5 表示中心点 0,1 表示左上角 1,0 表示右下角 0,0.5 表示左中点 1,0.5 表示右中点 0.5,0 表示下中点 0.5,1 表示上中点
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float u_time; // uniform 表示变量为可读可写变量 与 attribute 的区别是 uniform 可以在顶点着色器和片元着色器中使用 attribute 只能在顶点着色器中使用 varying 可以在顶点着色器和片元着色器中使用
    void main() {
      gl_FragColor = vec4(vUv.x, vUv.y, sin(u_time), 1.0);
    }
  `,
  uniforms: {
    u_time: { value: 0 },
  },
});

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
// 使用基础材质
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, shaderMaterial);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

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
