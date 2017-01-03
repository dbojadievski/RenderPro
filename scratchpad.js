/* 
    * Note(Dino):
    *  This is the version that renders in an optimized, sorted way. 
    * It's not yet usable, because it doesn't take account transforms in mind. 
    */

for ( var keyEffect in sortedRenderables )
{
    var sublist                     = sortedRenderables[ keyEffect ];
    if ( sublist.length > 0 )
        for ( var keyTex in sublist )
        {
            var texLists = sublist[ keyTex ];
            var shader = sublist.lastRenderable.effect;
            shader.use ( gl );
            currentEffect           = shader;
            if ( texLists.length > 0 )
            {
                /* Perform texture switching only on the first instance; all are rendered with the same texture, so we don't need to do it more than once. */
                var firstByTexture  = texLists [ 0 ];
                gl.activeTexture ( gl.TEXTURE0 );
                gl.bindTexture ( gl.TEXTURE_2D, firstByTexture.texture.texture );
            }
            /* Here, we should just draw. */
            setUniforms ( )
            console.log ( texLists );
        }
}