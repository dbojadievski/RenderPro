( function ( ) 
{
    function RenderableInstance ( renderable, sceneNode )
    {
        this.renderable             = renderable;
        this.sceneNode              = sceneNode;
    }

    renderPro.graphics.rendering.RenderableInstance = RenderableInstance;
 } ) ( );