( function ( ) 
{
    function DirectionalLight ( direction, ambient, diffuse, specular )
    {
        this.direction                  = direction;
        
        this.ambient                    = ambient;
        this.diffuse                    = diffuse;
        this.specular                   = specular;    
    }


    function PointLight ( position, ambient, diffuse, specular )
    {
        this.position                   = position;
        this.ambient                    = ambient;
        this.diffuse                    = diffuse;
        this.specular                   = specular;
    }


    function SpotLight ( 
        position, 
        ambient, diffuse, specular, 
        spotDirection, spotExponent, spotCutoffAngle,
        attenuation, computeDistanceAttenuation ) 
    {
        this.position                   = position;
        
        this.ambient                    = ambient;
        this.diffuse                    = diffuse;
        this.specular                   = specular;

        this.attenuation                = attenuation;
        this.computeDistanceAttenuation = computeDistanceAttenuation;
        
        
        this.spotDirection              = spotDirection;
        this.spotExponent               = spotExponent;
        this.spotCutoffAngle            = spotCutoffAngle;
    }

    renderPro.graphics.scene.lighting.SpotLight           = SpotLight;
    renderPro.graphics.scene.lighting.PointLight          = PointLight;
    renderPro.graphics.scene.lighting.DirectionalLight    = DirectionalLight;
} ) ( );