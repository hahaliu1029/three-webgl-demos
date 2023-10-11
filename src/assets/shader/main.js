import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// 倒入顶点着色器
import basicVertexShader from "./raw/vertex.glsl";
// 倒入片元着色器
import basicFragmentShader from "./raw/fragment.glsl";
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

// 导入纹理贴图
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./img/sea.png");

// 创建着色器材质
// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: basicVertexShader,
//   fragmentShader: basicFragmentShader,
//   uniforms: {
//     u_time: { value: 0 },
//   },
//   side: THREE.DoubleSide,
// });

// 创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  uniforms: {
    u_time: { value: 0 },
    u_texture: { value: texture },
  },
  side: THREE.DoubleSide,
//   wireframe: true,
});

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(10, 10, 64, 64);
// 使用基础材质
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, rawShaderMaterial);
plane.rotation.x = Math.PI / 2;
// plane.receiveShadow = true;
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

// 增加光线辅助器
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(dirLightHelper);

// 设置时钟
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  // 更新着色器材质中的时间
  rawShaderMaterial.uniforms.u_time.value = time;
  // 更新着色器材质中的时间
  // shaderMaterial.uniforms.u_time.value = time;
  // 更新光线辅助器
  dirLightHelper.update();

  renderer.render(scene, camera);
}

animate();
