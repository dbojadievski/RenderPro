var assets = 
{
    "shaders":
    [
        {
            "id": "0001",
            "name": "wexbimFlatVertexShader",
            "type": "VERTEX",
            "content": " attribute highp float aVertexIndex; attribute highp float aTransformationIndex; attribute highp float aStyleIndex; attribute highp float aProduct; attribute highp vec2 aState; attribute highp vec2 aNormal; uniform float uMetre; uniform mat4 uTMatrix; uniform float uLightAmbientFront; uniform float uLightAmbientBack; uniform vec4 uLightAmbientFrontColor; uniform vec4 uLightAmbientBackColor; uniform vec4 uHighlightColour; uniform float uGamma; uniform int uRenderingMode; uniform highp sampler2D uVertexSampler; uniform int uVertexTextureSize; uniform highp sampler2D uMatrixSampler; uniform int uMatrixTextureSize; uniform highp sampler2D uStyleSampler; uniform int uStyleTextureSize; uniform highp sampler2D uStateStyleSampler; /* Colours to go to the fragment shader. */ varying vec4 vFrontColor; varying vec4 vBackColor; varying vec3 vPosition; varying float vDiscard; vec3 getNormal ( ) { float U                             = aNormal[0]; float V                             = aNormal[1]; float PI                            = 3.1415926535897932384626433832795; float lon                           = U / 252.0 * 2.0 * PI; float lat                           = V / 252.0 * PI; float x                             = sin ( lon ) * sin ( lat ); float z                             = cos ( lon ) * sin ( lat ); float y                             = cos ( lat ); return normalize ( vec3 ( x, y, z ) ); } vec2 getTextureCoordinates( int index, int size ) { float x                             = float ( index - ( index / size ) * size ); float y                             = float ( index / size ); float pixelSize                     = 1.0 / float ( size ); return vec2 ( ( x + 0.5 ) * pixelSize, ( y + 0.5 ) * pixelSize ); } vec4 getColor ( ) { if ( uRenderingMode == 2 ) { return vec4 ( 0.0, 0.0, 0.3, 0.5 ); } int restyle                         = int ( floor ( aState[1] + 0.5 ) ); if ( restyle > 224 ) { int index                       = int ( floor ( aStyleIndex + 0.5 ) ); vec2 coords                     = getTextureCoordinates ( index, uStyleTextureSize ); return texture2D ( uStyleSampler, coords ); } vec2 coords                         = getTextureCoordinates( restyle, 15 ); return texture2D(uStateStyleSampler, coords); } vec3 getVertexPosition ( ) { int index                           = int ( floor ( aVertexIndex +0.5 ) ); vec2 coords                         = getTextureCoordinates ( index, uVertexTextureSize ); vec3 point                          = vec3 ( texture2D ( uVertexSampler, coords ) ); int tIndex                          = int ( floor ( aTransformationIndex + 0.5 ) ); if ( tIndex != 65535 ) { tIndex                          *=4; mat4 transform                  = mat4 ( texture2D ( uMatrixSampler, getTextureCoordinates ( tIndex, uMatrixTextureSize ) ), texture2D ( uMatrixSampler, getTextureCoordinates ( tIndex+1, uMatrixTextureSize ) ), texture2D ( uMatrixSampler, getTextureCoordinates ( tIndex+2, uMatrixTextureSize ) ), texture2D ( uMatrixSampler, getTextureCoordinates ( tIndex+3, uMatrixTextureSize ) ) ); return vec3 (transform * vec4 ( point, 1.0 ) ); } return point; } void main ( void ) { vec3 vertex                         = getVertexPosition(); vec3 normal                         = getNormal(); vec3 backNormal                     = normal * -1.0; int state                           = int ( floor ( aState[0] + 0.5 ) ); int restyle                         = int ( floor ( aState[1] + 0.5 ) ); /* Is this vertice hidden, or is this the first stage of xray rendering and unstylized? */ if (state == 254 || (uRenderingMode == 1 && !(state == 253 || state == 252)) || (uRenderingMode == 2 && (state == 253 || state == 252))) { vDiscard                        = 1.0; return; } else { vDiscard                        = 0.0; } vec4 baseColor                  = state == 253 ? uHighlightColour : getColor(); /* Offset semitransparent triangles. */ if (baseColor.a < 0.98 && uRenderingMode == 0) { mat4 transpose              = mat4 ( 1 ); vec3 trans                  = -0.002 * uMetre * normalize ( normal ); transpose[3]                = vec4 ( trans,1.0 ); vertex                      = vec3 ( transpose * vec4 ( vertex, 1.0 ) ); } /* These are the final transformations to the colour needed to simulate lighting. Note that lights do not affect the colour transparency! */ vFrontColor                     = vec4 ( baseColor.rgb * uLightAmbientFrontColor.rgb * uLightAmbientFront, baseColor.a ); vBackColor                      = vec4 ( baseColor.rgb * uLightAmbientBackColor.rgb * uLightAmbientBack, baseColor.a ); /* Finally, perform gamma colour-correction. This is the final transformation done to the colour in the fragment shader. */ vec4 gamma                          = vec4( 1.0 / uGamma ) ; vFrontColor                         = pow ( vFrontColor, gamma ); vBackColor                          = pow ( vBackColor, gamma ); vPosition                           = vertex; gl_Position                         = uTMatrix * vec4 ( vertex, 1.0 ); }"
        },
        {
            "id": "0002",
            "name": "wexbimFlatFragmentShader",
            "type": "FRAGMENT",
            "content": " precision mediump float; uniform vec4 uClippingPlane; varying vec4 vFrontColor; varying vec4 vBackColor; /* Position in world-space. This is used for clipping. */ varying vec3 vPosition; /* State passed to fragment shader. */ varying float vDiscard; void main(void) { if ( vDiscard > 0.001 ) discard; if ( length ( uClippingPlane ) > 0.001) { /* Clipping test. */ vec4 p				= uClippingPlane; vec3 x				= vPosition; float distance		= (dot(p.xyz, x) + p.w) / length(p.xyz); if ( distance < 0.0 ) { discard; } } /* Fix wrong normals (supposing the orientation of vertices is correct, but normals are flipped). */ gl_FragColor			= gl_FrontFacing ? vFrontColor : vBackColor; }"
        },
        {
            "id": "0003",
            "name": "standardFlatVertexShader",
            "type": "VERTEX",
            "content": "attribute vec3 aVertexNormal;\nattribute vec3 aVertexPosition;\nattribute vec2 aVertexTextureCoordinate;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform mat4 uMMatrix;\n\nvarying highp vec2 vTextCoord;\nvarying vec3 vVertexNormal;            \n\nvoid main(void) \n{\n    gl_Position     = uPMatrix * uMVMatrix * uMMatrix * vec4(aVertexPosition, 1.0);\n\n    vVertexNormal   = aVertexNormal;\n    vTextCoord      = aVertexTextureCoordinate;\n}\n"
        },
        {
            "id": "0004",
            "name": "standardFlatFragmentShader",
            "type": "FRAGMENT",
            "content": "precision mediump float;\n            \nstruct directionalLight\n{\n    vec3 direction;\n\n    vec4 ambient;\n    vec4 diffuse;\n    vec4 specular;\n};\n\nstruct material\n{\n    vec4 ambient;\n    vec4 diffuse;\n    vec4 specular;\n    float shininess;\n};\n\nuniform vec3 uEyePosition;\n\nuniform directionalLight uDirectionalLight;\n\nvarying highp vec2 vTextCoord;\nuniform material uMaterial;\nuniform sampler2D uSampler;\nvarying vec3 vVertexNormal;\n\nvec4 directionalLightColor ( vec3 normal, vec4 diffuse, directionalLight light )\n{\n    vec4 computedColor      = vec4 ( 0.0, 0.0, 0.0, 1.0 );\n    float ndotl; // Dot of the normal and light direction.\n\n    ndotl                   = max ( 0.0, dot ( normal, light.direction ) );\n    \n    computedColor           += ( light.ambient * uMaterial.ambient );\n    computedColor           += ( ndotl * light.diffuse * diffuse );\n\n    return computedColor;\n}\n\nvoid main ( void ) \n{\n    vec4 diffuseColor       = texture2D ( uSampler, vec2 ( vTextCoord.s, vTextCoord.t ) );\n    vec4 lightContribution  = directionalLightColor ( vVertexNormal, diffuseColor, uDirectionalLight );\n    gl_FragColor            = lightContribution + diffuseColor;\n    gl_FragColor            = diffuseColor; // Uncomment to preview diffuse texture only.  \n    // gl_FragColor            = lightContribution; // Uncomment to preview light colour only.\n}\n"
        }
    ],
    "textures":
    [
        { 
            "id":       "1001", 
            "content":  "assets\\textures\\crate.gif"
        },
        { 
            "id":       "1002", 
            "content": "assets\\textures\\cubetexture.png"
        },
        {
            "id":       "1003",
            "content": "assets\\textures\\water.png"
        },
        {
            "id":       "1004",
            "content":  "assets\\textures\\nehe.gif"
        },
        {
            "id":       "1005",
            "content":  "assets\\textures\\metallic.png"
        }
    ],
    "materials":
    [
        {
            "id": "2001",
            "content": "newmtl my_material\n Ka 1.0 1.0 1.0\n Kd 1.0 1.0 1.0\n Ks 1.0 1.0 1.0\n Ns 36.0\n d 1.0\n map_Kd -o 0.0 0.0 0.0 crate.gif\n map_Ks -s 0.0 1.0 crate.gif\n bump -imfchan r -bm 2 -texres 256 -mm 1 1 nehe.gif"
        },
        {
            "id": "2002",
            "content": "newmtl crate_material\n Ka 1.0 1.0 1.0\n Kd 1.0 1.0 1.0\n Ks 1.0 1.0 1.0\n Ns 36.0\n map_Kd crate.gif\n"
        },
        {
            "id": "2003",
            "content": spacker.untitled_0="# Blender MTL File: 'None'\n# Material Count: 1\n\nnewmtl Material\nNs 96.078431\nKa 1.000000 1.000000 1.000000\nKd 0.640000 0.640000 0.640000\nKs 0.500000 0.500000 0.500000\nKe 0.000000 0.000000 0.000000\nNi 1.000000\nd 1.000000\nmap_Kd crate.gif\nillum 2\n"
        }
    ],
    "meshes":
    [
        {
            "id": "3001",
            "content":
            [
                {

                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "1.0", "-1.0" ]
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "-1.0" ] 
                },
                {
                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    position:       [ "1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "1.0", "-1.0" ]
                },
                {
                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "-1.0" ] 
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "-1.0" ]
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "-1.0" ]
                },
                {
                    "uv":           [ "1.0", "0.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "-1.0", "1.0" ]
                },
                {
                    "uv":           [ "0.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "1.0" ]
                },
                {
                    "uv":           [ "1.0", "1.0" ],
                    "normal":       [ "0.0", "0.0", "0.0" ],
                    "position":     [ "-1.0", "1.0", "-1.0" ]
                }
            ]
        }
    ],
    "modelsOLD":
    [
        {
            "id": "4001",
            "content": 
            {
                "parentID":         null,
                "transform":    
                [ 
                    "1.0", "0.0", "0.0", "0.0", 
                    "0.0", "1.0", "0.0", "0.0", 
                    "0.0", "0.0", "1.0", "0.0", 
                    "0.0", "0.0", "0.0", "1.0" 
                ],
                "renderables":
                [
                    {
                        "mesh":         [ "3001" ],
                        "material":     [ "2002" ],
                        "texture":      [ "1001" ]
                    }
                ]

            }
        }
    ],
    "models":
    [
        {
            "id": "4005",
            "content": "# Blender v2.78 (sub 0) OBJ File: 'untitled.blend'\n# www.blender.org\nmtllib untitled.mtl\no Cube\nv -1.000000 -1.000000 0.000000\nv 1.000000 -1.000000 0.000000\nv 1.000000 1.000000 0.000000\nv -1.000000 1.000000 0.000000\nv -1.000000 -1.000000 -2.000000\nv -1.000000 1.000000 -2.000000\nv 1.000000 1.000000 -2.000000\nv 1.000000 -1.000000 -2.000000\nv -1.000000 1.000000 -2.000000\nv -1.000000 1.000000 0.000000\nv 1.000000 1.000000 0.000000\nv 1.000000 1.000000 -2.000000\nv -1.000000 -1.000000 -2.000000\nv 1.000000 -1.000000 -2.000000\nv 1.000000 -1.000000 0.000000\nv -1.000000 -1.000000 0.000000\nv 1.000000 -1.000000 -2.000000\nv 1.000000 1.000000 -2.000000\nv 1.000000 1.000000 0.000000\nv 1.000000 -1.000000 0.000000\nv -1.000000 -1.000000 -2.000000\nv -1.000000 -1.000000 0.000000\nv -1.000000 1.000000 0.000000\nv -1.000000  1.000000 -2.000000\nvt 0.000000 0.000000\nvt 1.000000 0.000000\nvt 1.000000 1.000000\nvt 0.000000 1.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nvn 0.000000 0.000000 0.000000\nusemtl Material\ns off\nf 1/1/1 2/2/2 3/3/3\nf 1/4/1 3/1/3 4/2/4\nf 5/3/5 6/4/6 7/1/7\nf 5/2/5 7/3/7 8/4/8\nf 9/1/9 10/2/10 11/3/11\nf 9/4/9 11/1/11 12/2/12\nf 13/3/13 14/4/14 15/1/15\nf 13/2/13 15/3/15 16/4/16\nf 17/1/17 18/2/18 19/3/19\nf 17/4/17 19/1/19 20/2/20\nf 21/3/21 22/4/22 23/1/23\nf 21/2/21 23/3/23 24/4/24"
        }
    ]
};

