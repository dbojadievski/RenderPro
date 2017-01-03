( function ( ) 
{
    function Mesh ( vertices, vertexSize, indices, indexSize )
    {
        this.vertices               = vertices;
        this.vertexSize             = vertexSize;
        this.vertexCount            = vertices.length;
        
        this.indices                = indices;
        this.indexSize              = indexSize;
        this.indexCount             = indices.length;
    }

    renderPro.graphics.core.Mesh         = Mesh;
} ) ( );