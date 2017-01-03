( function ( ) 
{
    function Material ( ambient, diffuse, specular, shininess )
    {
        this.ambient                    = ambient;
        this.diffuse                    = diffuse;
        this.specular                   = specular;
        this.shininess                  = shininess;
    }

    renderPro.graphics.core.Material    = Material;
} ) ( );