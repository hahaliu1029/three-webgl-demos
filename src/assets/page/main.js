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
camera.position.set(0, 0, 18);
scene.add(camera);

// 创建1000个立方体
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

let cubeArr = [];
let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(i * 2 - 5, j * 2 - 5, z * 2 - 5);
      cubeGroup.add(cube);
      cubeArr.push(cube);
    }
  }
}
scene.add(cubeGroup);
// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 监听鼠标位置
const mouse = new THREE.Vector2();
document.addEventListener("mousemove", (event) => {
  // 计算鼠标位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  raycaster.intersectObjects(cubeArr).forEach((item) => {
    item.object.material = redMaterial;
  });
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景阴影贴图
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();
// 创建坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

// 使用points设置随机顶点制作星河
function createPoints(url, size = 0.5) {
  const pointsMaterial = new THREE.PointsMaterial({
    // 黄色
    color: 0xffff00,
    size: 0.5,
    // 深度测试
    depthWrite: false,
    // 深度测试函数
    depthTest: false,
    blending: THREE.AdditiveBlending, // 使用加法混合
    // 设置顶点颜色
    vertexColors: true,
  });
  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);
  // 设置点材质全部使用同一个纹理
  pointsMaterial.map = texture;
  pointsMaterial.transparent = true;
  pointsMaterial.alphaMap = texture;
  const pointsGeometry = new THREE.BufferGeometry();
  const count = 5000;

  // 设置缓冲区数组
  const vertices = new Float32Array(count * 3);

  // 设置顶点颜色
  const colors = new Float32Array(count * 3);

  // 设置顶点
  for (let i = 0; i < count * 3; i++) {
    vertices[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
  }

  pointsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  pointsGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  points.position.y = -50;
  scene.add(points);
  return points;
}

const points1 = createPoints("./img/snow.png");
const points2 = createPoints("./img/star.jpg");

// 设置当前页数
let currentPage = 0;

// 监听滚动事件
document.addEventListener("scroll", (event) => {
  // 获取滚动页数
  const newPage = Math.floor(window.scrollY / window.innerHeight);
  // 判断是否翻页
  if (newPage !== currentPage) {
    console.log(newPage);

    currentPage = newPage;
    gsap.to(`.page${currentPage} h1`, {
      duration: 1,
      rotate: "+=360",
      opacity: 1,
      ease: "power2.inOut",
    });
    // h3飞入
    gsap.fromTo(
      `.page${currentPage} h3`,
      {
        opacity: 0,
        x: -300,
      },
      {
        duration: 1,
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
      }
    );
    // 翻页动画
    if (currentPage === 2) {
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: -105,
        z: 10,
        ease: "power2.inOut",
      });
    } else if (currentPage === 0) {
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: 18,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(camera.position, {
        x: 0,
        y: -currentPage * 50 - 10,
        z: 18,
        ease: "power2.inOut",
      });
    }
  }
});

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./img/star.jpg");

const params = {
  count: 5000,
  size: 0.1,
  radius: 5,
  branches: 6,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let stargeometry = null;
let starmaterial = null;
let points = null;
const generateGalaxy = () => {
  // 生成顶点
  stargeometry = new THREE.BufferGeometry();
  // 随即生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const centerColor = new THREE.Color(params.color);
  const endColor = new THREE.Color(params.endColor);

  // 循环生成点
  for (let i = 0; i < params.count; i++) {
    // 当前的点应该在哪一条分支的角度上
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    // 当前点距离中心的距离
    const distanceFromCenter =
      Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3; // 当前顶点索引
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) *
        (params.radius - distanceFromCenter)) /
      5;
    positions[current] =
      Math.cos(branchAngle + distanceFromCenter * params.rotateScale) *
        distanceFromCenter +
      randomX; // 顶点x轴坐标
    positions[current + 1] = 0 + randomY; // 顶点y轴坐标
    positions[current + 2] =
      Math.sin(branchAngle + distanceFromCenter * params.rotateScale) *
        distanceFromCenter +
      randomZ; // 顶点z轴坐标

    // 混合颜色，形成渐变色
    const mixedColor = centerColor.clone();
    mixedColor.lerp(endColor, distanceFromCenter / params.radius);
    colors[current] = mixedColor.r;
    colors[current + 1] = mixedColor.g;
    colors[current + 2] = mixedColor.b;
  }
  stargeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  ); // 设置顶点位置
  stargeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // 设置顶点颜色

  // 设置点材质
  starmaterial = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true, // 设置顶点颜色
    // color: new THREE.Color(params.color),
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
  });
  points = new THREE.Points(stargeometry, starmaterial);
  points.position.y = -105;
  points.rotation.x = -Math.PI / 2;
  scene.add(points);
};

generateGalaxy();

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  cubeGroup.rotation.x = time * 0.5;
  cubeGroup.rotation.y = time * 0.5;
  points1.rotation.x = time * 0.3;
  points2.rotation.x = time * 0.3;
  points1.rotation.y = time * 0.05;
  points2.rotation.y = time * 0.05;

  // required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();
  renderer.render(scene, camera);
}

animate();
