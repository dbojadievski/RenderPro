( function ( ) 
{
    function RenderableInstance ( renderable, transform )
    {
        this.renderable             = renderable;
        this.transform              = transform;
    }

    renderPro.graphics.rendering.RenderableInstance = RenderableInstance;
 } ) ( );