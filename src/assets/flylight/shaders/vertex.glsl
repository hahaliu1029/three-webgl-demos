precision mediump float;
varying vec2 vUv;
varying vec4 vPosition;
varying vec4 gPosition;
void main() {
  vUv = uv; // uv 表示顶点的纹理坐标 0,0 表示左下角 1,1 表示右上角 0.5,0.5 表示中心点 0,1 表示左上角 1,0 表示右下角 0,0.5 表示左中点 1,0.5 表示右中点 0.5,0 表示下中点 0.5,1 表示上中点
  vec4 modelPosition = modelMatrix * vec4(position.xyz, 1.0);
  gPosition = vec4(position.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition; // 模型视图矩阵
  vPosition = modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}