var assets = 
{
    "textures":
    [
        { 
            "id":       "1001", 
            "content":  "crate.gif"
        },
        { 
            "id":       "1002", 
            "content": "cubetexture.png"
        },
        {
            "id":       "1003",
            "content": "water.png"
        },
        {
            "id":       "1004",
            "content":  "nehe.gif"
        },
        {
            "id":       "1005",
            "content":  "metallic.png"
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
        // {
        //     "id":                       "4001",
        //     "content":                  "o my_cube_2.obj\n g crate box\n usemtl crate_material\n #front face\n v -1.000000 -1.00000 1.000000\n v 1.000000 -1.000000 1.000000\n v 1.000000 1.000000 1.000000\n v -1.000000 1.000000 1.000000\n #back face\n v -1.000000 -1.000000 -1.000000\n v -1.000000 1.000000 -1.000000\n v 1.000000 1.000000 -1.000000\n v 1.000000 -1.000000 -1.000000\n #top face\n v -1.000000 1.000000 -1.000000\n v -1.000000 1.000000 1.000000\n v 1.000000 1.000000 1.000000\n v 1.000000 1.000000 -1.000000\n #bottom face\n v -1.000000 -1.000000 -1.000000\n v 1.000000 -1.000000 -1.000000\n v 1.000000 -1.000000 1.000000\n v -1.000000 -1.000000 1.000000\n #right face\n v 1.000000 -1.000000 -1.000000\n v 1.000000 1.000000 -1.000000\n v 1.000000 1.000000 1.000000\n v 1.000000 -1.000000 1.000000\n #left face\n v -1.000000 -1.000000 -1.000000\n v -1.000000 -1.000000 1.000000\n v -1.000000 1.000000 1.000000\n v -1.000000 1.000000 -1.000000\n #front face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #back face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #top face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #bottom face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #right face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #left face\n vt 0.0 0.0\n vt 1.0 0.0\n vt 1.0 1.0\n vt 0.0 1.0\n #front face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n #back face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n #top face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n #bottom face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n #left face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n #right face\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n vn 0.0 0.0 0.0\n f 1 2 3 4\n f 5 6 7 8\n f 9 10 11 12\n f 13 14 15 16\n f 17 18 19 20\n f 21 22 23 24\n"
        // },
        {
            "id": "4002",
            "content": "# Blender v2.78 (sub 0) OBJ File: ''\n# www.blender.org\nmtllib untitled.mtl\no Cube\nv 1.000000 -1.000000 -1.000000\nv 1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 1.000000\nv -1.000000 -1.000000 -1.000000\nv 1.000000 1.000000 -0.999999\nv 0.999999 1.000000 1.000001\nv -1.000000 1.000000 1.000000\nv -1.000000 1.000000 -1.000000\nvn 0.0000 -1.0000 0.0000\nvn 0.0000 1.0000 0.0000\nvn 1.0000 -0.0000 0.0000\nvn 0.0000 -0.0000 1.0000\nvn -1.0000 -0.0000 -0.0000\nvn 0.0000 0.0000 -1.0000\nusemtl Material\ns off\nf 2//1 4//1 1//1\nf 8//2 6//2 5//2\nf 5//3 2//3 1//3\nf 6//4 3//4 2//4\nf 3//5 8//5 4//5\nf 1//6 8//6 5//6\nf 2//1 3//1 4//1\nf 8//2 7//2 6//2\nf 5//3 6//3 2//3\nf 6//4 7//4 3//4\nf 3//5 7//5 8//5\nf 1//6 4//6 8//6\n"
        }
    ]
};