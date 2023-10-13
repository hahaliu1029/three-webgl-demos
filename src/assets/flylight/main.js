import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// 倒入顶点着色器
import basicVertexShader from "./shaders/vertex.glsl";
// 倒入片元着色器
import basicFragmentShader from "./shaders/fragment.glsl";

// 导入rgbloader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// 导入gltfLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.3;
// renderer.toneMapping = THREE.LinearToneMapping;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
controls.update();
// 创建坐标轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 创建环境纹理
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./model/night.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

const gltfLoader = new GLTFLoader();
let flylightBox = null;
gltfLoader.load("./model/kongmingdeng.glb", (gltf) => {
  console.log(gltf);
  const model = gltf.scene;
  // model.scale.set(0.1, 0.1, 0.1);
  // model.position.set(0, -5, 0);
  lightBox = gltf.scene.children[0];
  lightBox.material = shaderMaterial;
  scene.add(model);
});

// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
  transparent: true,
});

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
