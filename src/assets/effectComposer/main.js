import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 纹理加载器
import { TextureLoader } from "three/src/loaders/TextureLoader";

// dat.gui
import * as dat from "dat.gui";

// 导入RGBELoader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 导入GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入效果组合器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

// three框架本身自带效果
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js"; // 点阵效果

import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js"; // 抗锯齿效果

import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"; // 发光效果

import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js"; // 胶片效果

import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js"; // 故障效果

import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"; // 自定义着色器效果

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

// 添加dat.gui
const gui = new dat.GUI();

// 加载HDR贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./img/royal_esplanade_1k.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
  scene.background = texture;
});

// 加载模型
const gltfLoader = new GLTFLoader();
gltfLoader
  .loadAsync("./model/DamagedHelmet/DamagedHelmet.gltf")
  .then((gltf) => {
    console.log(gltf);
    gltf.scene.scale.set(10, 10, 10);
    scene.add(gltf.scene);
  });

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// 创建坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

// 创建纹理加载器
const textureLoader = new TextureLoader();

// 合成效果
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
// 渲染通道
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 点阵效果
const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
composer.addPass(dotScreenPass);
gui.add(dotScreenPass, "enabled").name("点阵效果");

// 抗锯齿效果
const smaaPass = new SMAAPass();
smaaPass.enabled = false;
composer.addPass(smaaPass);
gui.add(smaaPass, "enabled").name("抗锯齿效果");

// 发光效果
const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.enabled = false;
composer.addPass(unrealBloomPass);
unrealBloomPass.strength = 1;
unrealBloomPass.radius = 0;
unrealBloomPass.threshold = 0.6;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = Math.pow(0.7, 4.0);

// 胶片效果
const filmPass = new FilmPass();
filmPass.enabled = false;
composer.addPass(filmPass);
gui.add(filmPass, "enabled").name("胶片效果");

// 故障效果
const glitchPass = new GlitchPass();
glitchPass.enabled = false;
composer.addPass(glitchPass);
gui.add(glitchPass, "enabled").name("故障效果");

// 自定义着色器效果

const colorParams = {
  r: 0,
  g: 0,
  b: 0.5,
};

const shaderPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new THREE.Vector2(1, 1) },
      u_color: {
        value: new THREE.Vector3(colorParams.r, colorParams.g, colorParams.b),
      },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );
        }
        `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform vec3 u_color;
        void main() {
            vec4 texel = texture2D( tDiffuse, vUv );
            texel.xyz += u_color;
            gl_FragColor = texel;
        }
        `,
  }),
  "tDiffuse" // tDiffuse is the default name for the texture in shaderPass
);
shaderPass.enabled = false;
composer.addPass(shaderPass);
gui.add(shaderPass, "enabled").name("自定义着色器效果");

gui.add(unrealBloomPass, "enabled").name("发光效果");
gui.add(unrealBloomPass, "strength", 0, 3).name("强度");
gui.add(unrealBloomPass, "radius", 0, 1).name("半径");
gui.add(unrealBloomPass, "threshold", 0, 1).name("阈值");
gui.add(renderer, "toneMappingExposure", 0, 1).name("曝光度");

const normalTexture = textureLoader.load("./model/DamagedHelmet/interfaceNormalMap.png");
const techPass = new ShaderPass(
  new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      resolution: { value: new THREE.Vector2(1, 1) },
      u_normalTexture: { value: null },
      u_time: { value: 0 },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );
        }
        `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform sampler2D u_normalTexture;
        uniform float u_time;
        void main() {
            vec2 newUv = vUv;
            newUv += sin(newUv.x * 10.0 + u_time * 0.5) * 0.03;

            vec4 texel = texture2D( tDiffuse, newUv );
            vec4 normalTexel = texture2D( u_normalTexture, vUv );
            // 设置光线的角度
            vec3 lightDirection = normalize(vec3(-5.0, 5.0, 2.0));
            float lightness = clamp(dot(normalTexel.xyz, lightDirection), 0.0, 1.0);
            // 通过光线角度设置颜色
            texel.xyz += lightness;
            gl_FragColor = texel;
        }
        `,
  }),
  "tDiffuse" // tDiffuse is the default name for the texture in shaderPass
);
techPass.material.uniforms.u_normalTexture.value = normalTexture;
composer.addPass(techPass);

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  techPass.material.uniforms.u_time.value = time;

  //   renderer.render(scene, camera);
  composer.render();
}

animate();
