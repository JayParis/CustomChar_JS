uniform sampler2D uSkinMap;
uniform sampler2D uEnvironmentMap;

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 Grad3(vec3 A, vec3 B, vec3 C, float mid, float t){
    vec3 mixA = mix(A, B, clamp(t / mid, 0.0, 1.0));
    return mix(mixA, C, clamp(t - mid, 0.0, 1.0) * (1.0 / (1.0 - mid)));
}

float qMap(float value, float A, float B){
    return clamp((1.0 / (B - A)) * (value - A), 0.0, 1.0);
}

float clamp01(float value){
    return clamp(value,0.0,1.0);
}

float calcLightSpecular(float gloss, vec3 worldNormal, vec3 h, float powerMod) {
    float nh = max( dot( h, worldNormal ), 0.0 );
    float specPow = exp2(gloss * 11.0 * powerMod); // glossiness is linear, power is not; 0 - 2048
    // Hack: On Mac OS X, calling pow with zero for the exponent generates hideous artifacts so bias up a little
    specPow = max(specPow, 0.0001);
    return pow(nh, specPow) * (specPow + 2.0) / 8.0;
}

// dDiffuseLight (contains 3x3 shadow map)
// light0_direction
// dHalfDirW
// dSpecularLight

vec3 OLD(){
    vec3 ret = vec3(1.0);

    float shadow0 = getShadowPCF5x5(SHADOWMAP_PASS(light0_shadowMap), light0_shadowParams);
    //ret = vec3(shadow0,shadow0,shadow0) + dDiffuseLight;

    float fullDiffuse = dot(dVertexNormalW, light0_direction) * -1.0;
    
    float hardDiffuse = clamp(qMap(fullDiffuse, 0.086364,0.2),0.0,1.0);
    float sharpDiffuse = clamp(qMap(fullDiffuse, 0.113,0.114),0.0,1.0);
    float customLightFalloff = mix(hardDiffuse, sharpDiffuse, 0.1);
    float customLightFalloffShadowed = customLightFalloff * shadow0;

    // ret = vec3(customLightFalloff,customLightFalloff,customLightFalloff);
    // ret *= shadow0;


    vec3 skinColourA = vec3(1.0, 0.8549, 0.6823);
    vec3 skinColourB = vec3(0.7686, 0.3647, 0.5019) * 0.995;

    float skinAO = texture(uSkinMap, vUv0).r;
    vec3 skinAOColour = mix(skinColourB,skinColourA,qMap(skinAO,0.6481818,0.927273));

    // vec3 skinLightFalloffColour = mix(skinColourB,skinColourA,qMap(customLightFalloff,0.6481818,0.927273));
    vec3 skinLightFalloffColour = mix(skinColourB,skinColourA,customLightFalloffShadowed);


    vec3 combinedSkinColour = mix(skinLightFalloffColour, vec3(1.0),0.05) * skinAOColour; // Needs testing with many colours
    

    float fresnel = pow(1.0 - dot(normalize(dViewDirW), normalize(dVertexNormalW)), 5.0); //7.0

    vec3 reflectVec = normalize(reflect(dViewDirW, dVertexNormalW));
    vec2 refUV;
    refUV.x = atan( -reflectVec.z, -reflectVec.x ) * 0.15915494 + 0.5; // Computing longitude
    refUV.y = reflectVec.y * 0.5 + 0.5; // Computing latitude

    vec3 reflectionCol = texture(uEnvironmentMap, refUV).rgb;
    // ret = (combinedSkinColour * 0.58) + (reflectionCol * 0.15);
    ret = mix((combinedSkinColour * 0.58), (reflectionCol * 0.915),0.10);
    ret += fresnel * customLightFalloffShadowed * 0.75; //2.09

    float backlightMask = pow(abs(fullDiffuse), 0.75); // 2.0 3.0
    /*

    float spec_1 = clamp01(calcLightSpecular(0.15,dVertexNormalW,dViewDirW,1.0));
    spec_1 = qMap(spec_1,0.05,1.0) * 0.3;
    spec_1 *= 1.0 - clamp01(((backlightMask * clamp01(fullDiffuse * -1.0)) * 4.0));
    // spec_1 *= backlightMask * 3.0;
    // spec_1 *= hardDiffuse;

    ret = mix(ret,vec3(1.0,1.0,1.0),spec_1 * 3.0);

    float spec_2_Top = clamp01(calcLightSpecular(0.99,dVertexNormalW,dViewDirW,1.2));
    float spec_2_Bottom = clamp01(calcLightSpecular(0.9,dVertexNormalW,dViewDirW,1.2));

    ret *= 1.0 - ((spec_2_Bottom - spec_2_Top) * 0.05);
    ret += spec_2_Top * 0.15;
    */

    float spec_1 = clamp01(calcLightSpecular(0.15,dVertexNormalW,dViewDirW,1.0));
    spec_1 = qMap(spec_1,0.05,1.0) * 0.3;
    spec_1 *= 1.0 - clamp01(((backlightMask * clamp01(fullDiffuse * -1.0)) * 4.0));
    spec_1 *= customLightFalloffShadowed;
    
    ret = mix(ret,vec3(1.0,1.0,1.0),spec_1 * 3.0);

    float spec_2_Top = clamp01(calcLightSpecular(0.99,dVertexNormalW,dViewDirW,1.2));
    float spec_2_Bottom = clamp01(calcLightSpecular(0.9,dVertexNormalW,dViewDirW,1.2));

    ret *= 1.0 - ((spec_2_Bottom - spec_2_Top) * 0.05);
    ret += spec_2_Top * 0.15;

    float spec_3 = clamp01(calcLightSpecular(0.15,dVertexNormalW,dViewDirW,1.0));
    spec_3 = qMap(spec_3,0.405,1.0) * 0.3;
    spec_3 *= customLightFalloffShadowed;

    ret += spec_3 * 1.915;
    

    // ret *= (1.0 - customLightFalloffShadowed) * 0.75 + customLightFalloffShadowed;

    // return vec3((1.0 - customLightFalloffShadowed) * 0.5 + customLightFalloffShadowed);
    //ret = texture(uSkinMap,vUv0).rgb;
    // ret = vec3(spec_2);
    return ret * 3.0;
}

vec3 combineColor(){
    vec3 ret = vec3(1.0); 
    
    float shadow0 = getShadowPCF5x5(SHADOWMAP_PASS(light0_shadowMap), light0_shadowParams);
    // float NdotL = dot(dVertexNormalW, light0_direction) * -1.0;
    float NdotL = dot(dNormalW, light0_direction) * -1.0;
    float sharpness = 0.24;
    float diffuse = smoothstep(-sharpness,sharpness,NdotL);

    shadow0 = clamp01(shadow0 + 0.6);
    float attenuation = clamp01(diffuse * shadow0);

    vec3 skinColourTop = vec3(1.0, 0.75, 0.57);
    vec3 skinColourMid = vec3(0.84, 0.34, 0.22);
    vec3 skinColourDark = vec3(0.84, 0.35, 0.23) * 0.40;

    //  skinColourTop = vec3(0.57, 0.85, 1.0);
    //  skinColourMid = vec3(0.22, 0.56, 0.84);
    //  skinColourDark = vec3(0.23, 0.46, 0.84) * 0.40;

    vec3 skinColourSSS = vec3(0.97, 0.64, 0.56);
    vec3 skinColourSSS2 = vec3(0.98, 0.75, 0.7);
    vec3 skinColourSSS3 = vec3(0.34, 0.11, 0.06);
    
    //  skinColourSSS3 = vec3(0.13, 0.06, 0.34);


    vec3 lightSkinColour = Grad3(skinColourDark,skinColourMid,skinColourTop,0.5,attenuation);

    // float skinAO = qMap(texture(uSkinMap, vUv0).r,0.6481818,0.927273);
    float skinAO = qMap(texture(uSkinMap, vUv0).r,0.311818,0.927273);
    // attenuation *= skinAO;
    // skinAO = 1.0; // Delete
    lightSkinColour = mix(skinColourMid * 0.51,lightSkinColour,skinAO);

    float sharpness2 = 0.65;
    float diffuse2 = smoothstep(-sharpness2,sharpness2,NdotL);

    lightSkinColour = mix(skinColourSSS3 * 0.494,lightSkinColour,diffuse2);

    float spec_1 = clamp01(calcLightSpecular(0.15,dVertexNormalW,dViewDirW,1.0));
    spec_1 = pow(spec_1,2.0) * 1.55;
    spec_1 *= clamp01(attenuation + 0.135) * 1.0;

    float fresnel = pow(1.0 - dot(normalize(dViewDirW), normalize(dVertexNormalW)), 5.0); //7.0

    lightSkinColour = mix(lightSkinColour,vec3(1.0),spec_1);
    lightSkinColour += fresnel * attenuation * 0.75;

    float spec_2 = clamp01(calcLightSpecular(0.9,dVertexNormalW,dViewDirW,1.20));
    spec_2 *= clamp01(attenuation + 0.05);
    spec_2 = clamp01(dSpecularLight.r);

    // lightSkinColour += spec_2;
    lightSkinColour = mix(lightSkinColour,vec3(0.9),spec_2);

    // lightSkinColour = mix(skinColourMid * 0.25,lightSkinColour, skinAO * attenuation);

    ret = lightSkinColour;
    // ret = vec3(dSpecularLight.r); //dSpecularLight
    // ret = vec3(clamp01(spec_2));
    // ret = vec3(skinAO * attenuation);
    // ret = vec3(dot(dNormalW,light0_direction * -1.0));
    // ret = vec3(clamp01(dot(dNormalW * 2.0, normalize(light0_direction * -1.0))));
    // ret = vec3(dot(dNormalW, light0_direction) * -1.0);
    return ret * 3.0;
    // return OLD();
}



