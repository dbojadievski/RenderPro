/* Several example material definitions, used for testing. */
var materialEmerald     = new renderPro.graphics.core.Material 
(
    [ 0.0215, 0.1745, 0.0215, 1.0 ],                 // Ambient light.
    [ 0.07568, 0.61424, 0.07568, 1.0 ],              // Diffuse light.
    [ 0.633, 0.727811, 0.633, 1.0 ],                 // Specular highlight.
    0.6                                             // Shininess.
);

var materialSilver      = new renderPro.graphics.core.Material
(
    [ 0.19225, 0.19225, 0.19225, 1.0 ],
    [ 0.50754, 0.50754, 0.50754, 1.0 ],
    [ 0.508273, 0.508273, 0.508273, 1.0 ],
    0.4
);

var materialRuby        = new renderPro.graphics.core.Material 
(
    [ 0.1745, 0.01175, 0.01175, 1.0 ],
    [ 0.61424, 0.04136, 0.04136, 1.0 ],
    [ 0.727811, 0.626959, 0.626959, 1.0 ],
    0.6
);

var materialWhite = new renderPro.graphics.core.Material
(
    [ 1.0, 1.0, 1.0, 1.0 ],
    [ 1.0, 1.0, 1.0, 1.0 ],
    [ 1.0, 1.0, 1.0, 1.0 ],
    1.0
);