import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
// 导入FBXLoader
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// 倒入顶点着色器
import basicVertexShader from "./shaders/vertex.glsl";
// 倒入片元着色器
import basicFragmentShader from "./shaders/fragment.glsl";

// 导入rgbloader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// 导入gltfLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Firework from "./firework";

// 导入水模块
import { Water } from "three/examples/jsm/objects/Water2.js";

// console.log(THREE)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 20);
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景阴影贴图
// renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.3;
// renderer.toneMapping = THREE.LinearToneMapping;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
controls.update();
// controls.autoRotate = true;
// controls.autoRotateSpeed = 0.1;
// // controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 4 * 3;
// controls.minPolarAngle = Math.PI / 4 * 3;
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
// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
  },
  // transparent: true,
});

const gltfLoader = new GLTFLoader();
let flylightBox = null;
gltfLoader.load("./model/kongmingdeng1.glb", (gltf) => {
  console.log(gltf);
  const model = gltf.scene;
  // model.scale.set(0.1, 0.1, 0.1);
  // model.position.set(0, -5, 0);
  lightBox = gltf.scene.children[0];
  // 获取模型高度
  const box = new THREE.Box3().setFromObject(lightBox);
  const height = box.max.y - box.min.y;
  console.log(height);
  gltf.scene.children[0].material = shaderMaterial;
  // scene.add(model);
  for (let i = 0; i < 150; i++) {
    const flylight = model.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() + 5;
    flylight.position.set(x, y, z);
    gsap.to(flylight.rotation, {
      duration: 5 + Math.random() * 30,
      y: Math.PI * 2,
      repeat: -1,
      ease: "none",
    });
    gsap.to(flylight.position, {
      duration: 5 + Math.random() * 30,
      // 上升
      y: " +=" + Math.random() * 20,
      x: "+=" + Math.random(),
      yoyo: true,
      repeat: -1,
      ease: "none",
    });
    scene.add(flylight);
  }
});

// 设置时钟
const clock = new THREE.Clock();

// 管理烟花
let fireworks = [];
// 创建烟花
let createFirework = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`; // 随机颜色  hsl(色相, 饱和度, 亮度) 0-360 0-100% 0-100%
  let position = {
    x: (Math.random() - 0.5) * 200,
    z: (Math.random() - 0.5) * 200,
    y: 20 + (Math.random() - 0.5) * 60,
  };
  // 生成颜色和位置
  let firework = new Firework(color, position);
  firework.addScene(scene, camera);
  fireworks.push(firework);
};

// 点击事件
document.addEventListener("click", () => {
  createFirework();
});

// 加载FBX模型
// const fbxLoader = new FBXLoader();
// fbxLoader.load("./model/building.FBX", (fbx) => {
//   console.log(fbx);
//   fbx.scale.set(0.1, 0.1, 0.1);
//   fbx.position.set(0, -5, 0);
//   scene.add(fbx);
// });

gltfLoader.load("./model/waitan.glb", (gltf) => {
  console.log(gltf);
  const model = gltf.scene;
  model.scale.set(0.1, 0.1, 0.1);
  model.position.set(0, -15, 0);
  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
  let water = new Water(waterGeometry, {
    scale: 4,
    flowDirection: new THREE.Vector2(1, 1),
    textureWidth: 1024,
    textureHeight: 1024,
    side: THREE.DoubleSide,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = -15.1;
  scene.add(water);
  gltf.scene.remove(gltf.scene.children[0])
  scene.add(model);
});


function animate() {
  // 更新烟花
  fireworks.forEach((firework, i) => {
    const type = firework.update();
    if(type == "remove") {
      fireworks.splice(i, 1);
    }
  });
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}


animate();
