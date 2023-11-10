
vec3 getTangent2() {
    vTangentW = normalize(dNormalMatrix * vertex_tangent.xyz);
    return normalize(dNormalMatrix * vertex_tangent.xyz);
}

vec3 getBinormal2() {
    vBinormalW = cross(vNormalW, vTangentW) * vertex_tangent.w;
    return cross(vNormalW, vTangentW) * vertex_tangent.w;
}

vec3 getObjectSpaceUp() {
    vTangentW = getTangent2();
    vBinormalW = getBinormal2();

    return normalize(dNormalMatrix * vec3(0, 1, 0));
}