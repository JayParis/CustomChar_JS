varying vec3 vTangentW2;
varying vec3 vBinormalW2;
varying vec3 testLVAL;

void main(void) {
    gl_Position = getPosition();
    vTangentW2 = vec3(1,0,0);
    vBinormalW2 = vec3(0,0,1);
    testLVAL = vec3(0,1,0.5);