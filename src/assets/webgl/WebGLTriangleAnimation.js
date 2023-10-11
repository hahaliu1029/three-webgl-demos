/**
 * 使用WebGL实现的三角形动画示例。
 * 
 * 功能概述:
 * - 初始化WebGL的canvas、上下文、视口等基本设置。
 * - 定义顶点和片元着色器并将它们连接到一个WebGL程序中。
 * - 创建并填充顶点缓冲区，定义三角形的三个顶点。
 * - 定义一个缩放矩阵，以实现动态的三角形缩放效果。
 * - 在动画循环中，持续增加三角形的缩放值并重新渲染，从而实现动态放大的效果。
 * 
 * 注意：该文件展示了如何使用纯WebGL（不依赖任何外部库）实现基本的三角形动画效果。
 */

// 获取canvas元素
const canvas = document.getElementById("canvas");
// 设置canvas宽高
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 获取webgl上下文
const gl = canvas.getContext("webgl");
// 设置视口
gl.viewport(0, 0, canvas.width, canvas.height);

// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  attribute vec4 a_Position; // 顶点位置  vec4 表示由4个浮点数组成的矢量 a_Position 表示变量名  attribute 表示限定符 表示变量为只读变量
  uniform mat4 u_xformMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_xformMatrix * a_Position;
    v_Color = gl_Position;
  }
`
);

// 编译顶点着色器
gl.compileShader(vertexShader);

// 创建片元着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision mediump float; // 设置精度 mediump 表示中等精度 float 表示浮点数 mediump float 表示中等精度浮点数 mediump 与 highp 的区别是小数点后面的位数不同
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`
);

// 编译片元着色器
gl.compileShader(fragmentShader);


// 创建程序连接着色器
const program = gl.createProgram(); // 创建程序
gl.attachShader(program, vertexShader); // 连接顶点着色器
gl.attachShader(program, fragmentShader); // 连接片元着色器
gl.linkProgram(program); // 链接程序

// 使用程序
gl.useProgram(program);

// 创建顶点缓冲区对象
const vertexBuffer = gl.createBuffer();
// 绑定顶点缓冲区对象
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定缓冲区对象 gl.ARRAY_BUFFER 表示缓冲区对象中包含了顶点的数据 gl.ELEMENT_ARRAY_BUFFER 表示缓冲区对象中包含了顶点的索引值
// 向缓冲区对象中写入数据
const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // STATIC_DRAW 表示只写入一次数据，但需要绘制很多次

// 获取顶点着色器中的变量
const a_Position = gl.getAttribLocation(program, "a_Position");
// 将缓冲区对象分配给变量
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // 将缓冲区对象分配给变量 a_Position    2 表示每次读取两个数据 gl.FLOAT 表示数据类型 false 表示不进行归一化处理 0 表示从缓冲区的第0个位置开始读取 
// 开启变量
gl.enableVertexAttribArray(a_Position);

// 清空画布
gl.clearColor(0.0, 0.0, 0.0, 0.0); // 设置清空画布颜色 rgba 0.0 - 1.0 之间 0.0 表示黑色 1.0 表示白色 
gl.clear(gl.COLOR_BUFFER_BIT); // 清空画布

const scale = {
  x: 0.5,
  y: 0.5,
  z: 0.5
};

let mat = new Float32Array([
  scale.x, 0.0, 0.0, 0.0,
  0.0, scale.y, 0.0, 0.0,
  0.0, 0.0, scale.z, 0.0,
  0.0, 0.0, 0.0, 1.0
]); // 缩放矩阵

const u_xformMatrix = gl.getUniformLocation(program, "u_xformMatrix"); // 获取缩放矩阵变量 u_xformMatrix 的存储位置 、
gl.uniformMatrix4fv(u_xformMatrix, false, mat); // 将缩放矩阵传递给顶点着色器

// 绘制图形
gl.drawArrays(gl.TRIANGLES, 0, 3); // gl.TRIANGLES 表示绘制三角形 0 表示从第0个顶点开始绘制 3 表示绘制3个顶点

function animate() {
  requestAnimationFrame(animate);
  scale.x += 0.001;
  scale.y += 0.001;
  scale.z += 0.001;
  mat[0] = scale.x;
  mat[5] = scale.y;
  mat[10] = scale.z;
  gl.uniformMatrix4fv(u_xformMatrix, false, mat); // 将缩放矩阵传递给顶点着色器
  gl.drawArrays(gl.TRIANGLES, 0, 3); // gl.TRIANGLES 表示绘制三角形 0 表示从第0个顶点开始绘制 3 表示绘制3个顶点
}

animate();


