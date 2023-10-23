varying vec2 vUv;
uniform float u_time; // uniform 表示变量为可读可写变量 与 attribute 的区别是 uniform 可以在顶点着色器和片元着色器中使用 attribute 只能在顶点着色器中使用 varying 可以在顶点着色器和片元着色器中使用
// 导入uTexture
uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
varying float vImgIndex;
varying vec3 vColor;
varying float vTime;
void main() {
  // gl_FragColor = vec4(gl_PointCoord, 0.0, 1.0);
  // 设置圆
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength*=2.0;
  // strength = 1.0 - strength;
  // // strength = step(0.5, strength);
  // gl_FragColor = vec4(strength);
  vec4 textureColor;

  if (vImgIndex == 0.0) {
    textureColor = texture2D(uTexture, gl_PointCoord);
  } else if (vImgIndex == 1.0) {
    textureColor = texture2D(uTexture1, gl_PointCoord);
  } else if (vImgIndex == 2.0) {
    textureColor = texture2D(uTexture2, gl_PointCoord);
  }
  // 颜色随时间变化
    // 使用sin函数和时间变量u_time生成循环颜色
  float r = sin(vTime + 0.0) * 0.5 + 0.5; // 红色分量
  float g = sin(vTime + 2.0) * 0.5 + 0.5; // 绿色分量
  float b = sin(vTime + 4.0) * 0.5 + 0.5; // 蓝色分量
  vec4 dynamicColor = vec4(r, g, b, 1.0); // 创建颜色向量
  gl_FragColor = vec4(dynamicColor.rgb, textureColor.r);
}