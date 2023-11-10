// varying vec3 vTangentW2;
// varying vec3 vBinormalW2;
// vec3 testLVAL = vec3(0,1,0.5);

void main(void) {
    dReflection = vec4(0);
    // gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    // vec3 VTW2 = vTangentW2;
    // vec3 VBW3 = vBinormalW2;

    #ifdef LIT_CLEARCOAT
    ccSpecularLight = vec3(0);
    ccReflection = vec3(0);
    #endif