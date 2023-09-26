#version 300 es

#define varying in

precision mediump float;

uniform highp sampler2DShadow light0_shadowMap;
uniform float uTime;

varying vec3 Normal;
varying vec2 TexCoord;
varying vec3 Position;

out vec4 FragColor;

void main()
{
    vec3 lightDirection = vec3(0.0,1.0,0.0);
    float lighting = dot(Normal,lightDirection);
    float bright = 6.0;


    // gl_FragColor = vec4(lighting * bright, 0.0, 0.0, 1.0); //tmp5
    FragColor = vec4(lighting * bright, 0.0, 0.0, 1.0);
}

