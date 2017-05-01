var renderPro;
(function (renderPro) {
    var graphics;
    (function (graphics) {
        var scene;
        (function (scene) {
            var lighting;
            (function (lighting) {
                var DirectionalLight = (function () {
                    function DirectionalLight(direction, ambient, diffuse, specular) {
                        this.direction = direction;
                        this.ambient = ambient;
                        this.diffuse = diffuse;
                        this.specular = specular;
                    }
                    return DirectionalLight;
                }());
                lighting.DirectionalLight = DirectionalLight;
                var PointLight = (function () {
                    function PointLight(position, ambient, diffuse, specular) {
                        this.position = position;
                        this.ambient = ambient;
                        this.diffuse = diffuse;
                        this.specular = specular;
                    }
                    return PointLight;
                }());
                lighting.PointLight = PointLight;
                var SpotLight = (function () {
                    function SpotLight(position, ambient, diffuse, specular, spotDirection, spotExponent, spotCutoffAngle, attenuation, computeDistanceAttenuation) {
                        this.position = position;
                        this.ambient = ambient;
                        this.diffuse = diffuse;
                        this.specular = specular;
                        this.attenuation = attenuation;
                        this.computeDistanceAttenuation = computeDistanceAttenuation;
                        this.spotDirection = spotDirection;
                        this.spotExponent = spotExponent;
                        this.spotCutoffAngle = spotCutoffAngle;
                    }
                    return SpotLight;
                }());
                lighting.SpotLight = SpotLight;
            })(lighting = scene.lighting || (scene.lighting = {}));
        })(scene = graphics.scene || (graphics.scene = {}));
    })(graphics = renderPro.graphics || (renderPro.graphics = {}));
})(renderPro || (renderPro = {}));
