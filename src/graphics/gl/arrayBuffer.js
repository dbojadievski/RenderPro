( function  ( ) 
{
    function ArrayBuffer ( )
    {
        this.pointer                    = renderPro.graphics.gl.context.createBuffer ( );
    }

    ArrayBuffer.prototype.bufferData    = function arrayBuffer_bufferData ( vertices )
    {
        var gl                          = renderPro.graphics.gl.context;
        gl.bindBuffer ( gl.ARRAY_BUFFER, this.pointer );
        gl.bufferData ( gl.ARRAY_BUFFER, new Float32Array ( vertices ), gl.STATIC_DRAW );
        gl.bindBuffer ( gl.ARRAY_BUFFER, null );
    };

    ArrayBuffer.prototype.free      = function arrayBuffer_free ( )
    {
        renderPro.graphics.gl.context.deleteBuffer ( this.pointer );
    };

    renderPro.graphics.gl.ArrayBuffer  = ArrayBuffer;
 } ) ( );