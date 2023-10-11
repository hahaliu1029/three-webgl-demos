precision mediump float;
varying vec2 vUv;
varying float vHeight;
uniform float u_time; // uniform 表示变量为可读可写变量 与 attribute 的区别是 uniform 可以在顶点着色器和片元着色器中使用 attribute 只能在顶点着色器中使用 varying 可以在顶点着色器和片元着色器中使用
uniform sampler2D u_texture;

void main() {
  float color = vHeight / 2.0 + 0.5;
  // 根据纹理坐标获取纹素颜色
  vec4 textureColor = texture2D(u_texture, vUv);
  gl_FragColor = textureColor;
  // gl_FragColor = vec4(vUv.x, vUv.y, sin(u_time), 1.0); 
}