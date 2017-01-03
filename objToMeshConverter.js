function objToMesh ( objMesh )
{
    var objPositions                        = [ ];
    var objIndices                          = [ ];
    var objNormals                          = [ ];
    var objUVs                              = [ ];

    var objVertices                         = [ ];

    /*
        * TODO(Dino): Compress OBJ loading into two loops.
        * We have four components to load, divided into two categories:
        * components of size 2, such as indices and UVs, and
        * components of size 3, such as positions and normals.
        * These can be loaded in two passes, 
        * by loading the size-two components first, 
        * and the size-three components next.
        * 
        * This would save us O(N) time on the loading. 
        */
    for ( var currVertexIndex = 0; currVertexIndex <= mesh.vertices.length - 3; currVertexIndex += 3 )
    {
        var normal                          = [ ];
        var position                        = [ ];

        normal[ 0 ]                         = mesh.vertexNormals[ currNormalIndex ];
        normal[ 1 ]                         = mesh.vertexNormals[ currNormalIndex + 1 ];
        normal[ 2 ]                         = mesh.vertexNormals[ currNormalIndex + 2 ];
        
        position[ 0 ]                       = mesh.vertices[ currVertexIndex ];
        position[ 1 ]                       = mesh.vertices[ currVertexIndex + 1 ];
        position[ 2 ]                       = mesh.vertices[ currVertexIndex + 2 ];

        objNormals.push ( normal ); 
        objPositions.push ( position ); 
    }

    for ( var currVertexIndex = 0; currVertexIndex < objPositions.length; currVertexIndex++ )
    {
        var vertex                          = new Vertex 
        ( 
            objPositions[ currVertexIndex ], objUVs[ currVertexIndex ], objNormals[ currVertexIndex ] 
        );
        objVertices.push ( vertex );
    }

    var objMesh                             = new renderPro.graphics.Mesh ( objVertices, 3, objIndices, 2 );

    return objMesh;
}