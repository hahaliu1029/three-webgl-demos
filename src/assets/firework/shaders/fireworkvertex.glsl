
attribute float aScale;
attribute vec3 aRandom;
uniform float uTime;
uniform float uSize;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.xyz += aRandom * uTime * 10.0;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    float size = uSize * aScale - (uTime * 20.0);
    // 如果size小于0.0，就让size等于0.0
    size = max(size, 0.0);
    gl_PointSize = size;
}