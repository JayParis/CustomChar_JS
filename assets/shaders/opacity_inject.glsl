#ifdef MAPFLOAT
uniform float material_opacity;
#endif

mat4 ditherMatrix = mat4(
    0, 8, 2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
);

void getOpacity() {
    dAlpha = 1.0;

    #ifdef MAPFLOAT
    dAlpha *= material_opacity;
    #endif

    #ifdef MAPTEXTURE
    dAlpha *= texture2DBias($SAMPLER, $UV, textureBias).$CH;
    #endif

    #ifdef MAPVERTEX
    dAlpha *= clamp(vVertexColor.$VC, 0.0, 1.0);
    #endif


    float ditherScale = 1.0;

    int mx = int(mod(gl_FragCoord.x * ditherScale, 4.0));
    int my = int(mod(gl_FragCoord.y * ditherScale, 4.0));

    float M = ditherMatrix[mx][my];
    M = (M / 16.0) - 0.0;

    dAlpha = clamp(M + (0.0 - (1.0 - dAlpha * 2.0)),0.0,1.0);
    //float alph = clamp(M + (0.0 - (1.0 - material_opacity * 2.0)),0.0,1.0);
}