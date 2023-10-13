precision lowp float;
varying vec4 vPosition;
varying vec3 gPostion;

void main() {
  vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);
  vec4 mixColor = mix(yellowColor, redColor, vPosition.y / 3.0);
  // 判断正面
  if(gl_FrontFacing) {
     gl_FragColor = vec4(mixColor.xyz - vPosition.y / 100.0 - 0.5, 1.0);
  } else {
     gl_FragColor = vec4(mixColor.xyz, 1.0);
  }
}