import * as THREE from "three";
import startVertexShader from "./shaders/startpointvertex.glsl";
import startFragmentShader from "./shaders/startpointfragment.glsl";
import fireworkVertexShader from "./shaders/fireworkvertex.glsl";
import fireworkFragmentShader from "./shaders/fireworkfragment.glsl";
export default class Firework {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    //创建烟花发射点
    this.startGeometry = new THREE.BufferGeometry();
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    this.startGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(startPositionArray, 3)
    ); // 设置烟花发射点的位置 3个一组 一个点的坐标

    // 设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startVertexShader,
      fragmentShader: startFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 20 },
      },
    });

    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.z;

    this.startGeometry.setAttribute(
      "aStep",
      new THREE.BufferAttribute(astepArray, 3)
    ); // 设置烟花发射点的位置 3个一组 一个点的坐标

    // 创建烟花发射点
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);

    // 开始计时
    this.clock = new THREE.Clock();

    // 创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    this.fireworksCount = 180 + Math.floor(Math.random() * 180);
    const positionFireworkArray = new Float32Array(this.fireworksCount * 3);
    const scaleFireworkArray = new Float32Array(this.fireworksCount);
    const durationFireworkArray = new Float32Array(this.fireworksCount * 3);
    for (let i = 0; i < this.fireworksCount; i++) {
      // 一开始烟花的位置
      positionFireworkArray[i * 3 + 0] = to.x;
      positionFireworkArray[i * 3 + 1] = to.y;
      positionFireworkArray[i * 3 + 2] = to.z;

      // 设置烟花所有粒子初始的大小
      scaleFireworkArray[i] = Math.random() * 20;
      // 设置四周发射的角度
      let theta = Math.random() * Math.PI * 2;
      let beta = Math.random() * Math.PI * 2;
      let r = Math.random();
      durationFireworkArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      durationFireworkArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      durationFireworkArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
    }
    this.fireworkGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionFireworkArray, 3)
    );
    this.fireworkGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleFireworkArray, 1)
    );
    this.fireworkGeometry.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(durationFireworkArray, 3)
    );

    this.fireworksMaterial = new THREE.ShaderMaterial({
      vertexShader: fireworkVertexShader,
      fragmentShader: fireworkFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0 },
      },
    });

    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );
  }

  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.camera = camera;
    this.scene = scene;
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    let time = elapsedTime;
    if (elapsedTime < 1) {
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else {
      time = elapsedTime - 1;
      this.startMaterial.uniforms.uSize.value = 0;
      this.scene.remove(this.startPoint);
      this.startPoint.clear();
      this.startMaterial.dispose();

      // 设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
    }
  }
}
