precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main() {
   vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
   vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);

  // 根据模型坐标系混合颜色 gPosition是模型坐标
   vec4 mixColor = mix(yellowColor, redColor, (gPosition.y + 3.0) / 3.0);

  // 判断正面
   if(gl_FrontFacing) {
   // 根据世界坐标系绘制颜色 vPosition是世界坐标
      gl_FragColor = vec4(mixColor.xyz - (vPosition.y - 20.0 ) / 80.0 - 0.1 , 1.0);
   } else {
      gl_FragColor = vec4(mixColor.xyz, 1.0);
   }
}