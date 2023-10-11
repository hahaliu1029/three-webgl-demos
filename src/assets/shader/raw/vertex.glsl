precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 tangent;
attribute vec4 bitangent;
uniform float time;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
// 获取时间
uniform float u_time;
varying vec2 vUv;
varying float vHeight;
void main() {
  vUv = uv; // uv 表示顶点的纹理坐标 0,0 表示左下角 1,1 表示右上角 0.5,0.5 表示中心点 0,1 表示左上角 1,0 表示右下角 0,0.5 表示左中点 1,0.5 表示右中点 0.5,0 表示下中点 0.5,1 表示上中点
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  // 获取高度
  vHeight = position.y;
  // 波浪效果随时间变化
  float wave = sin(position.x * 10.0 + u_time) * 0.1;
  // 波浪效果随高度变化
  float waveHeight = sin(position.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv = sin(uv.x * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv2 = sin(uv.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv3 = sin(uv.x * 10.0 + uv.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv4 = sin(uv.x * 10.0 + uv.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv5 = sin(uv.x * 10.0 + uv.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv6 = sin(uv.x * 10.0 + uv.y * 10.0 + u_time) * 0.1;
  // 波浪效果随 uv 变化
  float waveUv7 = sin(uv.x * 10.0 + uv.y * 10.0 + u_time) * 0.1;

  // 设置位置
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x + wave + waveUv + waveUv2 + waveUv3 + waveUv4 + waveUv5 + waveUv6 + waveUv7, position.y + waveHeight, position.z + wave + waveUv + waveUv2 + waveUv3 + waveUv4 + waveUv5 + waveUv6 + waveUv7, 1.0);
}
