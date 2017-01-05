( function ( )  
{
    /*
     * TODO(Dino):
     * Add support for textures and material loading. 
     */
    function loadObjFromString ( string )
    {
        /* Let's get rid of duplicate whitespaces. This makes parsing the string a lot easier. */
        string                      = string.replace(/  +/g, ' ');

        function ExportableVertex ( )
        {
            this.position           = null;
            this.textureCoordinates = null;
            this.normal             = null;
        }

        function ExportableModel ( name )
        {
            this.name               = name;
            this.faces              = [ ];
            this.vertices           = [ ];
        }

        function ExportableFace ( )
        {
            this.vertices           = [ ];
        }

        function Vertex ( )
        {
            this.normal             = null;
            this.position           = null;
            this.textureCoordinates = null;
            
            this.index              = null;
        }
        function Model ( name )
        {
            this.name               = name;
            this.faces              = [ ];
            this.normals            = [ ];
            this.vertices           = [ ];
            this.textureCoordinates = [ ];
        }

        var models                  = [ ];
        var exportableModels        = [ ];
        
        var currModel               = null;
        
        var lines                   = string.split ( '\n' );
        for ( var currLineIdx       = 0; currLineIdx < lines.length; currLineIdx++ )
        {
            var currLine            = lines[ currLineIdx ].trim ( );
            if ( currLine.length === 0 )
                continue;
            else
            {
                /*
                 * NOTE(Dino):
                 * The .obj format is simple to understand, though we're simplifying it further.
                 * Every non-empty line starts with either a single- or double-character prefix.
                 * The prefix determines what the line contains.
                 * These prefixes are as listed:
                 * - # delimiting a comment,
                 * - v delimiting vertex coordinates in three dimensions,
                 * - vn delimiting a vertex's normal in three dimensions,
                 * - vt delimiting a vertex's UV coordinates in either two or three dimensions,
                 * - f delimiting a list of vertices, by index, determining a face.
                 *      This is done in the format v vt vn if all three components are specified,
                 *      or v//vn if vertex texture coordinates are not available.
                 *      List the elements ofa face by index number, and not by value.
                 *      NOTE(Dino): indices start at element 1, instead of element 0!
                 */
                if ( currLine.charAt ( 0 ) === '#' )
                    continue;
                else if ( currLine.charAt ( 0 ) === 'v' )
                {
                    switch ( currLine.charAt ( 1 ) )
                    {
                        case " ":
                            var parts   = currLine.split ( ' ', 4 );
                            parts       = parts.slice ( 1 );
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            var vertexPosition = [ ];
                            for ( var currVertexPositionIdx = 0; currVertexPositionIdx < parts.length; currVertexPositionIdx++ )
                                vertexPosition.push ( parseFloat ( parts[ currVertexPositionIdx ] ) );
                            currModel.vertices.push ( vertexPosition );
                            break;
                        case "t":
                            var parts   = currLine.split ( ' ', 4 );
                            parts       = parts.slice ( 1 );
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            var texCoords = [ ];
                            for ( var currTexCoordIdx = 0; currTexCoordIdx < parts.length; currTexCoordIdx++ )
                                texCoords.push ( parseFloat ( parts[ currTexCoordIdx ] ) );
                            currModel.textureCoordinates.push ( texCoords );
                            break;
                        case "n":
                            var parts   = currLine.split ( ' ', 4 );
                            parts       = parts.slice ( 1 );
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            var normal  = [ ];
                            for ( var currNormalIdx = 0; currNormalIdx < parts.length; currNormalIdx++ )
                                normal.push ( parseFloat ( parts[ currNormalIdx ] ) );
                            currModel.normals.push ( normal );
                            break;
                        default:
                            Application.Debug.assert ( false, "OBJ file invalid." );
                    }
                }
                else if ( currLine.charAt ( 0 ) === 'f' )
                {
                    /* Faces. */
                    var parts               = currLine.split ( ' ' );
                    parts                   = parts.slice ( 1 );
                    var part                = parts[ 0 ];
                    var face                = [ ];
                    if ( part.includes ( "//" ) )
                    {
                        /* 
                         * The face does include specific information about normals. 
                         * NOTE(Dino): 
                         * Do keep in mind that a texture coordinate is missing!
                         * The appropriate result is 'null'.
                         */
                        /* TODO(Dino): Find an example of this type of model. */
                    }
                    else if ( part.includes( '/' ) )
                    {
                        /* The face includes specific information about texturing. */
                    }
                    else
                    {
                        Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                        for ( var currVertFace = 0; currVertFace < parts.length; currVertFace++ )
                        {
                            var idx         = parseInt ( parts[ currVertFace ] );
                            var vertex      = currModel.vertices[ idx - 1 ];
                            var vert        = new Vertex ( );
                            vert.position   = [ ];
                            vert.index      = idx;
                            for ( var vertexCoordIdx = 0; vertexCoordIdx < vertex.length; vertexCoordIdx++ )
                            {
                                vert.position.push ( parseFloat ( vertex[ vertexCoordIdx ] ) );                 
                            }
                            face.push ( vert );
                        }
                        currModel.faces.push ( face );
                    }
                }
                else if ( currLine.charAt ( 0 ) == 'o' )
                {
                    Application.Debug.assert ( currLine.charAt ( 1 ) === ' ', "OBJ file invalid" );
                    var name                = currLine.split ( ' ', 2 )[ 1 ].trim ( );
                    if ( currModel !== null )
                        models.push ( currModel );
                    currModel               = new Model ( name );
                }
                else
                    Application.Debug.assert ( false, "OBJ file invalid." );
            }
        }

        if ( currModel !== null )
            models.push ( currModel );
        

        for ( var modelIdx = 0; modelIdx < models.length; modelIdx++ )
        {
            var currModel                               = models[ modelIdx ];
            var exportableModel                         = new ExportableModel ( currModel.name );
            for ( var verticeIdx = 0; verticeIdx < currModel.vertices.length; verticeIdx++ )
            {
                /* Construct an exportable vertex. */
                var exportableVertex                    = new ExportableVertex ( );
                exportableVertex.position               = currModel.vertices[ verticeIdx ];
                if ( currModel.normals.length > verticeIdx )
                    exportableVertex.normal             = currModel.normals[ verticeIdx ];
                if ( currModel.textureCoordinates.length > verticeIdx )
                    exportableVertex.textureCoordinates = currModel.textureCoordinates[ verticeIdx ];
                exportableModel.vertices.push ( exportableVertex );
            }

            for ( var faceIdx = 0; faceIdx < currModel.faces.length; faceIdx++ )
            {
                var face                    = currModel.faces[ faceIdx ];
                var exportableFace          = new ExportableFace ( );
                for ( var currVertexIdx = 0; currVertexIdx < face.length; currVertexIdx++ )
                {
                    var vertexIdx           = face[ currVertexIdx ].index;
                    var vertexToPush        = exportableModel.vertices[ vertexIdx - 1 ];
                    vertexToPush.index      = vertexIdx;
                    exportableFace.vertices.push ( vertexToPush );
                }
                exportableModel.faces.push ( exportableFace );
            }

            exportableModels.push ( exportableModel );
        }
        
        return exportableModels;
    }

    renderPro.importers.loadGeometryFromObjectFile = loadObjFromString;
} ) ( );