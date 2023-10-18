precision mediump float;
uniform float uWaresFrequency;
uniform float uScale;
uniform float uXzScale;
uniform float uNoiseFrequency;
uniform float uNoiseScale;
uniform float uTime;

// 计算出的高度传递给片元着色器
varying float vElevation;

 // 随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    float c = cos(rotation); // cos 返回弧度的余弦值
    float s = sin(rotation); // sin 返回弧度的正弦值
    mat2 rotationMatrix = mat2(c, -s, s, c); // mat2 创建一个 2x2 矩阵 第一列为 c -s 第二列为 s c
    return rotationMatrix * (uv - mid) + mid;
}

// 噪声函数
float noise(vec2 uv) {
    vec2 i = floor(uv); // floor 返回小于或等于 x 的最大整数
    vec2 f = fract(uv); // fract 返回 x - floor(x)
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x), mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uWaresFrequency) * sin(modelPosition.z * uWaresFrequency * uXzScale);

    elevation += -abs(noise(vec2(modelPosition.x, modelPosition.z) * uNoiseFrequency + uTime) ) * uNoiseScale;

    vElevation = elevation;
    elevation *= uScale;

    modelPosition.y += elevation;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}