const assets = {    
    bpFont: new pc.Asset("Blender-Pro-Font", "font", {
        url: "./assets/fonts/BlenderPro-Medium.json",
    }),
    charSkinTex: new pc.Asset(
        "Char-Skin-Tex",
        "texture",
        { url: "./assets/textures/T000_Edit_WP.webp" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    charLow_AO: new pc.Asset(
        "Char-Low-AO",
        "texture",
        { url: "./assets/textures/CharLow_AO.webp" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    charLow_Norm: new pc.Asset(
        "Char-Low-Norm",
        "texture",
        { url: "./assets/textures/CharLow_Norm.webp" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    opaMapTest: new pc.Asset(
        "Opacity-Map-Test",
        "texture",
        { url: "./assets/textures/OpaMapTest.jpg" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    envMap: new pc.Asset(
        "Environment-Map",
        "texture",
        { url: "./assets/textures/BlurredSkybox.webp" },
        { type: pc.TEXTURETYPE_RGBP, mipmaps: false }
    ),
    // charGLB: new pc.Asset("Char-GLB", "container", {
    //     url: "./assets/models/RealToonTest_1.glb",
    // }),
    charSkinnedGLB: new pc.Asset("Char-Skinned-GLB", "container", {
        url: "./assets/models/RealToonTest_Rigged_Edit_3.glb",
    }),
    charHighGLB: new pc.Asset("Char-High-GLB", "container", {
        url: "./assets/models/FemaleBaseHigh_1.glb",
    }),
    charLowGLB: new pc.Asset("Char-Low-GLB", "container", {
        url: "./assets/models/FemaleBaseLow_1.glb",
    }),
    
    vs: new pc.Asset("Bolt-Vertex-Shader", "shader", {
        url: "./assets/shaders/bolt_vertex.glsl",
    }),
    fs: new pc.Asset("Bolt-Fragment-Shader", "shader", {
        url: "./assets/shaders/bolt_fragment.glsl",
    }),
    sdrInject: new pc.Asset("Shader-Inject", "shader", {
        url: "./assets/shaders/shader_inject.glsl",
    }),
    opaInject: new pc.Asset("Opacity-Inject", "shader", {
        url: "./assets/shaders/opacity_inject.glsl",
    }),
    brightnessContrast: new pc.Asset("BrightnessContrast-Script", "script", {
        url: "./scripts/posteffect-brightnesscontrast.js",
    }),
    bloom: new pc.Asset("Bloom-Script", "script", {
        url: "./scripts/posteffect-bloom.js",
    }),
    ssao: new pc.Asset("SSAO-Script", "script", {
        url: "./scripts/posteffect-ssao.js",
    }),
    bokeh: new pc.Asset("Bokeh-Script", "script", {
        url: "./scripts/posteffect-bokeh.js",
    }),
    safeArea: new pc.Asset("Safe-Area-Script", "script", {
        url: "./scripts/mobile-safe-area.js",
    }),
    physicalOps: new pc.Asset("Physical-Ops-Asset", "script", {
        url: "./scripts/physical-ops.js",
    }),
};

// --- Helper Methods

function clamp(number, min, max) {
	return Math.max(min, Math.min(number, max));
}