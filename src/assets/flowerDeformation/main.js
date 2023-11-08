import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 目标：点光源

const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 设置相机位置
camera.position.set(0, 0, 20);
scene.add(camera);

let params = {
  value:0
}

// 灯光
// 环境光
// const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
// scene.add(light);

// 添加hdr环境纹理
const loader = new RGBELoader();
loader.load("./img/hdr/farm_sunset_4k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping; // 环境映射
  scene.background = texture;
  scene.environment = texture;
});

// 加载glb模型
const dracoLoader = new DRACOLoader(); // draco解码器
dracoLoader.setDecoderPath("./draco/"); // 设置draco解码器路径
const gltfLoader = new GLTFLoader(); // gltf模型加载器
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./model/sphere1.glb", function (gltf) {
  console.log(gltf);
  let sphere1 = gltf.scene.children[0];
  scene.add(sphere1);
  gltfLoader.load("./model/sphere2.glb", function (gltf1) {
    sphere1.geometry.morphAttributes.position = [];
    sphere1.geometry.morphAttributes.position.push(
      gltf1.scene.children[0].geometry.attributes.position
    ); // 添加形变属性
    sphere1.updateMorphTargets(); // 更新形变属性
    sphere1.morphTargetInfluences[0] = 1; // 形变影响因子
    gsap.to(params, {
      value: 1,
      duration: 2,
      onUpdate: function () {
        sphere1.morphTargetInfluences[0] = params.value; // 形变影响因子
      },
    });
  });
});


// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  logarithmicDepthBuffer: true,
  antialias: true,
});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xcccccc, 1);
renderer.autoClear = false;
// 设置电影渲染模式
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.sortObjects = true;
renderer.logarithmicDepthBuffer = true;

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();
function render() {
  let time = clock.getDelta();
  controls.update();

  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
