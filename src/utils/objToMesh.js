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
        var currVertexIdx           = 0;
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
                        var tokens          = part.split ( "//" );
                        var v               = parseInt ( tokens[ 0 ] );
                        var vn              = parseInt ( tokens[ 1 ] );

                        var exportableVertex                    = new ExportableVertex ( );
                        exportableVertex.position               = currModel.vertices[ v + 1 ];
                        exportableVertex.textureCoordinates     = null;
                        exportableVertex.normal                 = currModel.normals[ vn + 1 ];
                    }
                    else if ( part.includes( '/' ) )
                    {
                        /* The face includes specific information about texturing and normals. */
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

                    /* Is this face a part of a group? */
                    if ( isInGroup )
                    {
                        // currGroup.value.push ( face );
                        for ( var currGroupIdx = 0; currGroupIdx < currGroups.length; currGroupIdx++ )
                        {
                            currGroups[ currGroupIdx ].value.push ( face );
                        }
                    }

                    /* Is there a material specified, or are we rolling unstyled? */
                    if ( currMaterial !== null )
                        face.material        = currMaterial;

                }
                else if ( currLine.startsWith ( 'usemtl' ) )
                {
                    var parts                = currLine.split ( ' ' );
                    var mtlName              = parts.length > 1 ? parts[ parts.length - 1] : "white";
                    currMaterial             = mtlName;
                    currModel.numMaterials++;
                }
                else if ( currLine.charAt ( 0 ) == 'o' )
                {
                    Application.Debug.assert ( currLine.charAt ( 1 ) === ' ', "OBJ file invalid" );
                    var name                 = currLine.split ( ' ', 2 )[ 1 ].trim ( );
                    if ( currModel !== null )
                        models.push ( currModel );
                    currModel                = new Model ( name );
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
                        var __name       = parts[ currPartIdx ];
                        var isGroupFound = false;
                        for ( var currGroupIdx = 0; currGroupIdx < currModel.groups.length; currGroupIdx++ )
                        if ( currModel.groups[ currGroupIdx ].key === groupName )
                        {
                            isGroupFound = true;
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
                exportableFace.material     = face.material;
                exportableModel.faces.push ( exportableFace );
            }

            for ( var groupIdx = 0; groupIdx < currModel.groups.length; groupIdx++ )
            {
                exportableModel.groups.push ( currModel.groups[ groupIdx ] );
            }

            exportableModel.numMaterials    = currModel.numMaterials;
            exportableModels.push ( exportableModel );
        }
        
        return exportableModels;
    }

    /* * * * * * * * * * * * * * * * * */
    /*            Unit tests           */
    /*                                 */
    /* * * * * * * * * * * * * * * * * */
    function loadObjFromStringUnitTest ( )
    {
        var isTestSuccessful                = true;



        var content                         = ""
                                            + "o my_cube_2.obj\n"
                                            + "g crate box\n"
                                            + "usemtl crate_material\n"
                                            + "#front face\n"
                                            + "v -1.000000 -1.00000 1.000000\n"
                                            + "v 1.000000 -1.000000 1.000000\n"
                                            + "v 1.000000 1.000000 1.000000\n"
                                            + "v -1.000000 1.000000 1.000000\n"
                                            + "#back face\n"
                                            + "v -1.000000 -1.000000 -1.000000\n"
                                            + "v -1.000000 1.000000 -1.000000\n"
                                            + "v 1.000000 1.000000 -1.000000\n"
                                            + "v 1.000000 -1.000000 -1.000000\n"
                                            + "#top face\n"
                                            + "v -1.000000 1.000000 -1.000000\n"
                                            + "v -1.000000 1.000000 1.000000\n"
                                            + "v 1.000000 1.000000 1.000000\n"
                                            + "v 1.000000 1.000000 -1.000000\n"
                                            + "#bottom face\n"
                                            + "v -1.000000 -1.000000 -1.000000\n"
                                            + "v 1.000000 -1.000000 -1.000000\n"
                                            + "v 1.000000 -1.000000 1.000000\n"
                                            + "v -1.000000 -1.000000 1.000000\n"
                                            + "#right face\n"
                                            + "v 1.000000 -1.000000 -1.000000\n"
                                            + "v 1.000000 1.000000 -1.000000\n"
                                            + "v 1.000000 1.000000 1.000000\n"
                                            + "v 1.000000 -1.000000 1.000000\n"
                                            + "#left face\n"
                                            + "v -1.000000 -1.000000 -1.000000\n"
                                            + "v -1.000000 -1.000000 1.000000\n"
                                            + "v -1.000000 1.000000 1.000000\n"
                                            + "v -1.000000 1.000000 -1.000000\n"
                                            + "#front face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            + "#back face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            +"#top face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            + "#bottom face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            + "#right face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            + "#left face\n"
                                            + "vt 0.0 0.0\n"
                                            + "vt 1.0 0.0\n"
                                            + "vt 1.0 1.0\n"
                                            + "vt 0.0 1.0\n"
                                            + "#front face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "#back face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "#top face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "#bottom face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "#left face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "#right face\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "vn 0.0 0.0 0.0\n"
                                            + "f 1 2 3 4\n"
                                            + "f 5 6 7 8\n"
                                            + "f 9 10 11 12\n"
                                            + "f 13 14 15 16\n"
                                            + "f 17 18 19 20\n"
                                            + "f 21 22 23 24\n"
                                            ;

        var parsed                          = loadObjFromString ( content );
        isTestSuccessful                    &= ( parsed !== null && parsed.length == 1 );
        Application.Debug.assert ( isTestSuccessful, "Obj file not loaded." );
        parsed                              = parsed[ 0 ];

        isTestSuccessful                    &= ( parsed.vertices.length == 24 );
        Application.Debug.assert ( isTestSuccessful, "Model vertex count incorrect." );

        isTestSuccessful                    &= ( parsed.faces.length == 6 );
        Application.Debug.assert ( isTestSuccessful, "Model face count incorrect." );

        Application.Debug.assert ( isTestSuccessful, "Test failed: loadObjFromStringUnitTest." );

        return isTestSuccessful;
    }

    ( function testRunner ( )  
    {
        loadObjFromStringUnitTest ( );
    } )  ( );
    renderPro.importers.loadGeometryFromObjectFile = loadObjFromString;
} ) ( );