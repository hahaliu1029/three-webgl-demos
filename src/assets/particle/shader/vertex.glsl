varying vec2 vUv;
attribute float imgIndex;
attribute float aScale;
varying float vImgIndex;
uniform float uTime;
varying vec3 vColor;
varying float vTime;
void main() {
  vImgIndex = imgIndex;
  vUv = uv; // uv 表示顶点的纹理坐标 0,0 表示左下角 1,1 表示右上角 0.5,0.5 表示中心点 0,1 表示左上角 1,0 表示右下角 0,0.5 表示左中点 1,0.5 表示右中点 0.5,0 表示下中点 0.5,1 表示上中点

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // 获取顶点角度
  float angle = atan(modelPosition.x, modelPosition.y);
  // 获取顶点距离
  float distance = length(modelPosition.xy);
  // 根据顶点距离设置旋转角度
  float angleOffset = 1.0 / distance * uTime;

  // 目前的顶点角度 + 旋转角度
  angle += angleOffset;

  // 旋转后的顶点坐标
  modelPosition.x = cos(angle) * distance;
  modelPosition.y = sin(angle) * distance;
  vec4 viewPosition = viewMatrix * modelPosition;
  // 顶点颜色
  vColor = color;
  // 顶点时间
  vTime = uTime;
  gl_Position = projectionMatrix * viewPosition;
  // 设置点的大小 根据viewPositiond的z值来设置点的大小
  gl_PointSize = 150.0 / (-viewPosition.z) * aScale;

}