( function ( ) 
{
    function ElementArrayBuffer ( gl )
    {
        this.pointer                        = renderPro.graphics.gl.context.createBuffer ( );
    }

    ElementArrayBuffer.prototype.bufferData = function elementArray_bufferData ( indices, gl )
    {
        var gl                              = renderPro.graphics.gl.context;

        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, this.pointer );
        gl.bufferData ( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array ( indices ), gl.STATIC_DRAW );
        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, null );
    };

    ElementArrayBuffer.prototype.free       = function elementArrayBuffer_free (  )
    {
        renderPro.graphics.gl.context.deleteBuffer ( this.pointer );
    };

    renderPro.graphics.gl.ElementArrayBuffer   = ElementArrayBuffer;
} ) ( );
