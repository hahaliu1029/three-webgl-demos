import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

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
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// 创建坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

const path = "./img/pisa/";
const format = ".png";
const urls = [
  path + "px" + format,
  path + "nx" + format,
  path + "py" + format,
  path + "ny" + format,
  path + "pz" + format,
  path + "nz" + format,
];

const textureCube = new THREE.CubeTextureLoader().load(urls);
scene.background = textureCube;

// 创建一个白色的平面，可投射阴影
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.position.set(0, 0, -5);
scene.add(plane);

// 加载模型纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./model/LeePerrySmith/Map-COL.jpg");
// 加载法向量纹理
const normalTexture = textureLoader.load(
  "./model/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg"
);

const customUniforms = {
  u_time: { value: 0 },
  u_resolution: { value: { x: 0, y: 0 } },
};

// 创建材质
const material = new THREE.MeshStandardMaterial({
  map: texture,
  normalMap: normalTexture,
});

material.onBeforeCompile = (shader) => {
  console.log(shader.vertexShader);

  shader.uniforms.u_time = customUniforms.u_time;

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
  uniform float u_time;
  `
  );

  // 法向量旋转
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
    #include <beginnormal_vertex>
    float angle = sin(position.y + u_time) * 0.5;
    mat2 rotateMatrix = rotate2d(angle);
    objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.u_time = customUniforms.u_time;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
  uniform float u_time;
  `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    float angle = sin(transformed.y + u_time) * 0.5;
    mat2 rotateMatrix = rotate2d(angle);
    transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

// 加载模型
const gltfLoader = new GLTFLoader();
gltfLoader.load("./model/LeePerrySmith/LeePerrySmith.glb", (gltf) => {
  let Mesh = gltf.scene.children[0];
  Mesh.material = material;
  Mesh.castShadow = true;
  // 设定自定义深度材质
  Mesh.customDepthMaterial = depthMaterial;
  scene.add(Mesh);
});

// 增加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.set(0, 0, 10);
scene.add(light);

// 增加光照helper
const helper = new THREE.DirectionalLightHelper(light, 5);
scene.add(helper);

// 增加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  customUniforms.u_time.value = time;

  renderer.render(scene, camera);
}

animate();
