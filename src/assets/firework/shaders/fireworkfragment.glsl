precision lowp float;
uniform vec3 uColor;
void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5)); // 距离
  float strength =  distanceToCenter * 2.0; // 强度
  strength = 1.0 - strength; // 强度反转
  strength = pow(strength, 1.5);
  gl_FragColor = vec4(uColor, strength);
}