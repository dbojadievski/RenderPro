( function ( ) 
{ 
    function SceneNode ( parentNode )
    {
        this.parent                     = parentNode;
        this.children                   = new Array ( );
    }

    function Scene ( )
    {
        this.children                   = [ ];
    }

    renderPro.graphics.scene.Scene      = Scene;
    renderPro.graphics.scene.SceneNode  = SceneNode;
} ) ( );
