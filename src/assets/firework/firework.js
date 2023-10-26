import * as THREE from "three";
import startVertexShader from "./shaders/startpointvertex.glsl";
import startFragmentShader from "./shaders/startpointfragment.glsl";
import fireworkVertexShader from "./shaders/fireworkvertex.glsl";
import fireworkFragmentShader from "./shaders/fireworkfragment.glsl";
export default class Firework {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    //创建烟花发射点
    this.startGeometry = new THREE.BufferGeometry();
    this.color = new THREE.Color(color);
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
        uColor: { value: this.color },
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
      scaleFireworkArray[i] = Math.random() + 0.5;
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
        uColor: { value: this.color },
      },
    });

    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireworksMaterial
    );

    // 创建音频
    this.listener = new THREE.AudioListener();
    this.listener1 = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.listener);
    this.sendSound = new THREE.Audio(this.listener1);

    // 创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(`./sound/pow${Math.floor(Math.random() * 4) + 1}.ogg`, (buffer) => {
      this.sound.setBuffer(buffer); // 设置音频
      this.sound.setLoop(false); // 设置是否循环
      this.sound.setVolume(1);
    });

    audioLoader.load(`./sound/send.mp3`, (buffer) => {
      this.sendSound.setBuffer(buffer); // 设置音频
      this.sendSound.setLoop(false); // 设置是否循环
      this.sendSound.setVolume(1);
    });
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
    if (elapsedTime < 1 && elapsedTime > 0.2) {
      if(!this.sendSound.isPlaying && !this.sendSoundplay){
        this.sendSound.play();
        this.sendSoundplay = true;
      }
      this.startMaterial.uniforms.uTime.value = elapsedTime;
      this.startMaterial.uniforms.uSize.value = 20;
    } else if (elapsedTime > 0.2) {
      time = elapsedTime - 1;
      this.startMaterial.uniforms.uSize.value = 0;
      this.scene.remove(this.startPoint);
      this.startPoint.clear();
      this.startMaterial.dispose();

      if(!this.sound.isPlaying&& !this.play){
        this.sound.play();
        this.play = true;
      }

      // 设置烟花显示
      this.fireworksMaterial.uniforms.uSize.value = 20;
      this.fireworksMaterial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireworksMaterial.uniforms.uSize.value = 0;
        this.fireworksMaterial.uniforms.uTime.value = 0;
        this.scene.remove(this.fireworks);
        this.fireworks.clear();
        this.fireworksMaterial.dispose();
        this.fireworkGeometry.dispose();
        return "remove";
      }
    }
  }
}
