( function ( ) 
{
    function Vertex ( position, uv, normal ) 
    {
        this.position           = position;
        this.uv                 = uv;
        this.normal             = normal;
    }

    Vertex.prototype.getSize    = function vertex_getSize ( )
    {
        var size                = 0;
        
        if ( this.position !== undefined )
            size                += this.position.length;
        
        if ( this.uv !== undefined )
            size                += this.size.length;

        if ( this.normal !== undefined )
            size                += this.normal.length;

        return size;
    };

    Vertex.prototype.getBuffer  = function vertex_getBuffer ( )
    {
        var buffer              = [ ];

        if ( this.position !== undefined )
            buffer              = buffer.concat ( this.position );
        
        return buffer;
    };

    renderPro.graphics.core.Vertex   = Vertex;
} ) ( );