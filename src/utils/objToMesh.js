( function ( )  
{ 
    /** TODO(Dino): Add support for negative(relative) indexing in faces. */
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
            this.normals            = [];
            this.textureCoordinates = [ ];
            this.groups             = [ ];
            this.numMaterials       = 0;
        }

        function ExportableFace ( )
        {
            this.vertices           = [ ];
            this.material           = null;
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
            this.numMaterials       = 0;
            this.groups             = [ ];
        }

        var models                  = [ ];
        var exportableModels        = [ ];
        
        var currModel               = null;
        var currMaterial            = null;

        var lines                   = string.split ( '\n' );
        var isInGroup               = false;
        var currGroup               = null;
        var currGroups              = [ ];
        var currUVIdx               = 0;
        var currVertexIdx           = 0;
        var currNormalIdx           = 0;

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
                 *      List the elements of a face by index number, and not by value.
                 *      NOTE(Dino): indices start at element 1, instead of element 0!
                 * -g delimiting a named group of faces. 
                 *      All faces found further on belong to this named group, 
                 *      until another group statement is found.
                 * -usemtl specifies 
                 */
                if ( currLine.charAt ( 0 ) === '#' )
                    continue;
                else if ( currLine.charAt ( 0 ) === 'v' )
                {
                    switch ( currLine.charAt ( 1 ) )
                    {
                        case " ":
                            currVertexIdx++;
                            var parts   = currLine.split ( ' ', 4 );
                            parts       = parts.slice ( 1 );
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            var vertexPosition = [ ];
                            for ( var currVertexPositionIdx = 0; currVertexPositionIdx < parts.length; currVertexPositionIdx++ )
                                vertexPosition.push ( parseFloat ( parts[ currVertexPositionIdx ] ) );
                            currModel.vertices.push ( vertexPosition );
                            break;
                        case "t":
                            currUVIdx++;
                            var parts   = currLine.split ( ' ', 4 );
                            parts       = parts.slice ( 1 );
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            var texCoords = [ ];
                            for ( var currTexCoordIdx = 0; currTexCoordIdx < parts.length; currTexCoordIdx++ )
                                texCoords.push ( parseFloat ( parts[ currTexCoordIdx ] ) );
                            currModel.textureCoordinates.push ( texCoords );
                            break;
                        case "n":
                            currNormalIdx++;
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
                    var parts                   = currLine.split ( ' ' );
                    parts                       = parts.slice ( 1 );
                    for ( var partIdx = 0; partIdx < parts.length; partIdx++ )
                    {
                        var part                = parts[ partIdx ];
                        var face                = new ExportableFace ( );
                        face.push               = function ( vertex ) 
                        { 
                            face.vertices.push ( vertex ); 
                        };

                        if ( part.includes ( "//" ) )
                        {
                            /* 
                            * The face does include specific information about normals. 
                            * NOTE(Dino): 
                            * Do keep in mind that a texture coordinate is missing!
                            * The appropriate result is 'null'.
                            */
                            /* TODO(Dino): Find an example of this type of model. */
                            var tokens                              = part.split ( "//" );
                            Application.Debug.assert ( tokens.length == 2, "Parts invalid." );
                            
                            var v                                   = parseInt ( tokens[ 0 ] );
                            v                                       = ( v > 0 ? v : ( currVertexIdx - v ) );
                            
                            var vn                                  = parseInt ( tokens[ 1 ] );
                            vn                                      = ( vn > 0 ? vn : ( currNormalIdx - vn ) );

                            var exportableVertex                    = new ExportableVertex ( );
                            exportableVertex.position               = currModel.vertices[ v - 1 ];
                            exportableVertex.textureCoordinates     = null;
                            exportableVertex.normal                 = currModel.normals[ vn - 1 ];
                            face.push ( exportableVertex );
                        }
                        else if ( part.includes( '/' ) )
                        {
                            /* The face includes specific information about texturing and normals. */
                            var tokens                              = part.split ( "/" );
                            Application.Debug.assert ( tokens.length == 3, "String invalid." );
                            
                            var v                                   = parseInt ( tokens[ 0 ] );
                            v                                       = ( v > 0 ? v : ( currVertexIdx - v ) );

                            var vt                                  = parseInt ( tokens[ 1 ] );
                            vt                                      = ( vt > 0 ? vt : ( currUVIdx - vt ) );
                            
                            var vn                                  = parseInt ( tokens[ 2 ] );
                            vn                                      = ( vn > 0 ? vn : ( currNormalIdx - vn ) );

                            var exportableVertex                    = new ExportableVertex ( );
                            exportableVertex.position               = currModel.vertices[ v - 1 ];
                            exportableVertex.textureCoordinates     = currModel.textureCoordinates[ vt - 1 ];
                            exportableVertex.normal                 = currModel.normals[ vn - 1 ];
                            face.push ( exportableVertex );
                        }
                        else
                        {
                            Application.Debug.assert ( currModel !== null, "OBJ file invalid." );
                            for ( var currVertFace = 0; currVertFace < parts.length; currVertFace++ )
                            {
                                var idx                             = parseInt ( parts[ currVertFace ] );
                                idx                                 = ( idx > 0 ? idx : ( currVertexIdx = idx ) );
                                
                                var vertex                          = currModel.vertices[ idx - 1 ];
                                var exportableVertex                = new Vertex ( );
                                exportableVertex.position           = [ ];
                                exportableVertex.index              = idx;

                                for ( var vertexCoordIdx = 0; vertexCoordIdx < vertex.length; vertexCoordIdx++ )
                                    exportableVertex.position.push ( parseFloat ( vertex[ vertexCoordIdx ] ) );                 

                                face.push ( exportableVertex );
                            }
                        }

                        /* Is this face a part of a group? */
                        if ( isInGroup )
                        {
                            for ( var currGroupIdx = 0; currGroupIdx < currGroups.length; currGroupIdx++ )
                                currGroups[ currGroupIdx ].value.push ( face );
                        }

                        /* Is there a material specified, or are we rolling unstyled? */
                        if ( currMaterial !== null )
                            face.material    = currMaterial;

                    }

                    currModel.faces.push ( face );
                }
                else if ( currLine.startsWith ( 'usemtl' ) )
                {
                    var parts                = currLine.split ( ' ' );
                    var mtlName              = parts.length > 1 ? parts[ parts.length - 1] : "white";
                    currMaterial             = mtlName;
                    currModel.numMaterials++;
                }
                else if ( currLine.startsWith ( 'mtllib' ) )
                {
                    var parts                = currLine.split ( ' ' );
                    Application.Debug.assert ( parts.length == 2 );
                    continue; // NOTE(Dino): I'm not sure how to handle material libraries over here, on the web.

                }
                else if ( currLine.charAt ( 0 ) == 'o' )
                {
                    Application.Debug.assert ( currLine.charAt ( 1 ) === ' ', "OBJ file invalid" );
                    var name                 = currLine.split ( ' ', 2 )[ 1 ].trim ( );
                    if ( currModel !== null )
                        models.push ( currModel );
                    currModel                = new ExportableModel ( name );
                }
                else if ( currLine.charAt ( 0 ) == 'g' )
                /* TODO(Dino): Multiple groups may be declared at once. */
                {
                    Application.Debug.assert ( currModel !== null );

                    var parts                = currLine.split (' ' );
                    currGroups               = [ ];
                    
                    if ( parts.length === 1 )
                        parts.push ( "default" );
                    
                    for ( var currPartIdx = 1; currPartIdx < parts.length; currPartIdx++ )
                    {
                        var __name          = parts[ currPartIdx ];
                        var isGroupFound    = false;
                        for ( var currGroupIdx = 0; currGroupIdx < currModel.groups.length; currGroupIdx++ )
                        if ( currModel.groups[ currGroupIdx ].key === groupName )
                        {
                            isGroupFound    = true;
                            currGroups.push ( currModel.groups ( currGroupIdx ) );
                            break;
                        }

                        if ( !isGroupFound )
                            currGroups.push ( new KeyValuePair ( __name, [ ] ) );
                    }

                    isInGroup               = true;

                    /* TODO(Dino): these groups aren't actually added to the model. */
                    for ( var currGroupIdx = 0; currGroupIdx < currGroups.length; currGroupIdx++ )
                    {
                        var isGroupFound    = false;
                        for ( var currModelGroupIdx = 0; currModelGroupIdx < currModel.groups.length; currModelGroupIdx++ )
                        {
                            if ( currModel.groups[ currModelGroupIdx ].key === currGroups[ currGroupIdx ].key )
                            {
                                isGroupFound = true;
                                break;
                            }
                        }

                        if ( !isGroupFound )
                            currModel.groups.push ( currGroups[ currGroupIdx ] );
                    }
                }
                else if ( currLine.charAt ( 0 ) == 's' )
                /* NOTE(Dino): this controls smooth shading across polygons, e.g per-fragment shading. Accepted values are 'on' and 'off'. */
                {

                }
                else
                {
                    Application.Debug.assert ( false, "OBJ file invalid." );
                }
            }
        }

        if ( currModel !== null )
            models.push ( currModel );
        
        return models;
    }

    /* * * * * * * * * * * * * * * * * */
    /*            Unit tests           */
    /*                                 */
    /* * * * * * * * * * * * * * * * * */
    function loadObjFromStringUnitTest ( )
    {
        var isTestSuccessful                = true;

        var parsed                          = loadObjFromString ( spacker.untitled );
        isTestSuccessful                    &= ( parsed !== null && parsed.length == 1 );
        Application.Debug.assert ( isTestSuccessful, "Obj file not loaded." );
        parsed                              = parsed[ 0 ];

        isTestSuccessful                    &= ( parsed.vertices.length == 8 );
        Application.Debug.assert ( isTestSuccessful, "Model vertex count incorrect." );

        isTestSuccessful                    &= ( parsed.faces.length == 12 );
        Application.Debug.assert ( isTestSuccessful, "Model face count incorrect." );

        isTestSuccessful                    &= ( parsed.normals.length == 6 );
        Application.Debug.assert ( isTestSuccessful, "Model normal count incorrect." );

        Application.Debug.assert ( isTestSuccessful, "Test failed: loadObjFromStringUnitTest." );

        return isTestSuccessful;
    }

    ( function testRunner ( )  
    {
        loadObjFromStringUnitTest ( );
    } )  ( );
    renderPro.importers.loadGeometryFromObjectFile = loadObjFromString;
} ) ( );