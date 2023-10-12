precision mediump float;
varying vec2 vUv;
uniform float u_time; // uniform 表示变量为可读可写变量 与 attribute 的区别是 uniform 可以在顶点着色器和片元着色器中使用 attribute 只能在顶点着色器中使用 varying 可以在顶点着色器和片元着色器中使用
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

void main() {
  // float strength = mod(vUv.y * 10.0, 1.0);// mod 取余数 10.0 表示 10.0 为浮点数 1.0 表示 1.0 为浮点数 两个浮点数相除结果为浮点数 两个整数相除结果为整数 10.0 为浮点数 10 为整数
  // strength = step(0.5, strength); // step(a, b) 如果 b < a 返回 0.0 否则返回 1.0
  // 取最小值
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // min(a, b) 返回 a 和 b 中较小的值
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 取最大值
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)); // max(a, b) 返回 a 和 b 中较大的值
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 取绝对值
  // float strength = abs(vUv.x - 0.5); // abs(a) 返回 a 的绝对值
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // // 取余数
  // float strength = mod(vUv.x * 10.0, 1.0); // mod(a, b) 返回 a 除以 b 的余数
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 利用取整实现条纹渐变
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 条纹相乘实现格子
  // float strength = floor(vUv.x * 10.0) * floor(vUv.y * 10.0) / 100.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 随机效果
  // float strength = random(vUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 随机 + 格子效果
  // float strength = random(vUv) * floor(vUv.x * 10.0) * floor(vUv.y * 10.0) / 100.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 根据distance计算两个向量的距离
  // float strength = distance(vUv, vec2(0.5, 0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 根据相除，实现星星
  // float strength =0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 旋转飞镖
  // vec2 uv = rotate(vUv, u_time, vec2(0.5, 0.5));
  // float strength = 0.15 / distance(vec2(uv.x, (uv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // strength += 0.15 / distance(vec2(uv.x, (uv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //
  // float strength = step(0.5, distance(vUv, vec2(0.5, 0.5)));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 圆环
  // float strength = 1.0- step(0.1, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 波浪环
  // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0 + u_time) * 0.1, vUv.y + sin(vUv.x * 30.0 + u_time) * 0.1);
  // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5, 0.5)) - 0.25));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // 根据角度实现螺旋渐变
  // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
  // float angle = atan(vUv.y - 0.5, vUv.x - 0.5); // atan(y, x) 返回点 (x, y) 与正 x 轴之间的角度
  // float strength = (angle + 3.14) / 6.28;
  // gl_FragColor = vec4(strength, strength, strength, alpha);
}