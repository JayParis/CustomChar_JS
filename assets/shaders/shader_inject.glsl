

vec3 combineColor(){
    vec3 ret = vec3(1.0);

    float shadow0 = getShadowPCF5x5(SHADOWMAP_PASS(light0_shadowMap), light0_shadowParams);
    ret = vec3(shadow0,shadow0,shadow0) + dDiffuseLight;

    // return vec3(M);
    return ret;
}

/*
void getEmission() {
    vec2 p = -1.0 + 2.0 * vUv0;

    // main code, *original shader by: 'Plasma' by Viktor Korsun (2011)
    float x = p.x;
    float y = p.y;
    float mov0 = x+y+cos(sin(iGlobalTime)*2.0)*100.+sin(x/100.)*1000.;
    float mov1 = y / 0.9 +  iGlobalTime;
    float mov2 = x / 0.2;
    float c1 = abs(sin(mov1+iGlobalTime)/2.+mov2/2.-mov1-mov2+iGlobalTime);
    float c2 = abs(sin(c1+sin(mov0/1000.+iGlobalTime)+sin(y/40.+iGlobalTime)+sin((x+y)/100.)*3.));
    float c3 = abs(sin(c2+cos(mov1+mov2+c2)+cos(mov2)+sin(x/1000.)));
 
    dEmission = vec3(c1, c2, c3) * 0.120;
    // dAlbedo = vec3(c1, c2, c3) * 0.80020;

    // dSpecularity = vec3(11.0,1.0,1.0);
}
*/

