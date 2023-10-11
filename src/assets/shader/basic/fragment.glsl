varying vec2 vUv;
    uniform float u_time; // uniform 表示变量为可读可写变量 与 attribute 的区别是 uniform 可以在顶点着色器和片元着色器中使用 attribute 只能在顶点着色器中使用 varying 可以在顶点着色器和片元着色器中使用
    void main() {
      gl_FragColor = vec4(vUv.x, vUv.y, sin(u_time), 1.0);
    }