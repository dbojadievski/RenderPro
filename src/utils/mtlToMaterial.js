var parseFloatExtended;
( function ( ) 
{
    var wavefront               = renderPro.utils.text.wavefront; // Imports the Wavefront namespace.
    function ExportableMaterial ( name )
    {
        this.name               = name;

        this.ambient            = null;
        this.diffuse            = null;
        this.specular           = null;
        this.shininess          = null;
        this.dissolve           = null;

        this.ambientMap         = null;
        this.diffuseMap         = null;
        this.specularMap        = null;
        this.specularCoeffMap   = null;
        this.alphaMap           = null;
        this.bumpMap            = null;
    }

    function Material ( name )
    {
        this.name               = name;

        this.ambient            = null;
        this.diffuse            = null;
        this.specular           = null;
        this.shininess          = null;
        this.dissolve           = null;

        this.ambientMap         = null;
        this.diffuseMap         = null;
        this.specularMap        = null;
        this.specularCoeffMap   = null;
        this.alphaMap           = null;
        this.bumpMap            = null;
    }

    function toExportableMaterial (material) 
    {
        let result = new ExportableMaterial(material.name);

        /* 
         * NOTE(Martin):
         * Wavefront supports only colours with three components. 
         * This adds a fourth alpha component and converts it into an array for easier handling by opengl.
         */
        result.ambient            = [ material.ambient.red, material.ambient.blue, material.ambient.green, 1 ];
        result.diffuse            = [ material.ambient.red, material.ambient.blue, material.ambient.green, 1 ];
        result.specular           = [ material.ambient.red, material.ambient.blue, material.ambient.green, 1 ];

        result.shininess          = material.shininess;
        result.dissolve           = material.dissolve;

        result.ambientMap         = material.ambientMap;
        result.diffuseMap         = material.diffuseMap;
        result.specularMap        = material.specularMap;
        result.specularCoeffMap   = material.specularCoeffMap;
        result.alphaMap           = material.alphaMap;
        result.bumpMap            = material.bumpMap;
        return result;
    }

    function ExportableTextureMap ( name )
    {
        this.name                   = name;

        this.blendU                 = true; // Sets horizontal blending.
        this.blendV                 = true; // Sets vertical blending.

        this.boostMipMapSharpness   = 0.0;
        
        /* NOTE(Dino): These are both set with the -mm flag. Example: -mm 0.5 0.5 */
        this.base                   = 0.0; // Sets the brightness modifier.
        this.gain                   = 1.0; // Sets the contrast value.

        this.originOffset           = [ 0.0, 0.0, 0.0 ];
        this.scale                  = [ 1.0, 1.0, 1.0 ];
        this.turbulence             = [ 0.0, 0.0, 0.0 ];
        this.textureResolution      = undefined; // The default is to go with the largest power-of-two which does not exceed the size of the original image.
        this.clamp                  = false;

        this.bumpMultiplier        = undefined;
        this.channel               = undefined; // Used only on scalar or bump textures.
    }

    function parseTextureMap ( tokens, startIdx )
    /*
     * NOTE(Dino):
     * The texture map is parsed from a string which has one obligatory parameter:
     * the texture map name.
     * 
     * This use-case would appear as 'bump lemur_bump.tga'.
     * The rest of the parameters are entirely optional,
     *  and could appear strictly before the texture name.
     */
    {
        Application.Debug.assert ( tokens !== null && tokens !== undefined, "Param not supplied." );
        Application.Debug.assert ( tokens instanceof Array, "Param not of type 'Array'." );


        var textureMap          = new ExportableTextureMap ( null );
        var isValid             = true;
        
        if ( tokens.length >= startIdx + 1 )
        {
            var nameCandidate   = null;
            for ( var currTokenIdx = startIdx; ( currTokenIdx < tokens.length && isValid ); currTokenIdx++ )
            {
                var token       = tokens[ currTokenIdx ];
                var isInParam   = false;
                if ( token.charAt ( 0 ) === '-' )
                /* Process a parameter. */
                {
                    var value   = tokens[ ++currTokenIdx ];
                    switch ( token )
                    {
                        case '-blendu':
                            if ( value == 'on' )
                                textureMap.blendU = true;
                            else if ( value == 'off' )
                                textureMap.blendU = false;
                            else
                                isValid           = false;
                            break;
                        case '-blendv':
                            if ( value == 'on' )
                                textureMap.blendV = true;
                            else if ( value == 'off' )
                                textureMap.blendV = false;
                            else
                                isValid           = false;
                            break;
                        case '-boost':
                            value                 = wavefront.parseSingleFloat ( [ value ], 0 );
                            if ( !isNaN ( value ) )
                                textureMap.boostMipMapSharpness = value;
                            else
                                isValid           = false;
                            break;
                        case '-mm':
                            var base              = wavefront.parseSingleFloat ( [ value ], 0 );
                            var gain              = wavefront.parseSingleFloat ( [ tokens [ ++currTokenIdx ] ], 0 );
                            if ( !isNaN ( base ) && !isNaN ( gain ) )
                            {
                                textureMap.base   = base;
                                textureMap.gain   = gain;
                            }
                            else
                                isValid           = false;
                            break;
                        case '-o':
                            /* 
                             * NOTE(Dino):
                             * This command has one mandatory and two optional arguments.
                             * The mandatory argument is a single 'u' coordinate.
                             * The rest are optional 'v' and 'w' coordinates.
                             * All three are arbitrary floating-point numbers.
                             */
                            var u                 = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx ] ], 0 );
                            if ( !isNaN ( u ) )
                            /* 
                             * NOTE(Dino): 
                             * If the text is ill-formed, the value for the mandatory parameter 
                             * will be missing, or at least it will not be a floating-point number.
                             */
                            {
                                /* NOTE(Dino): the default value for missing optionals is 0. */
                                var v                   = 0.0;
                                var w                   = 0.0;

                                /* 
                                 * Peek at the next token and determine whether it's an optional floating-point param.
                                 * If so, pop it and go at the next one. 
                                 */
                                var pV                  = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx + 1 ] ], 0 );
                                if ( !isNaN ( pV ) )
                                {
                                    v                   = pV;
                                    currTokenIdx++;
                                    var pW              = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx + 1 ] ], 0 );
                                    if ( !isNaN ( pW ) )
                                    {
                                        w               = pW;
                                        currTokenIdx++;
                                    }
                                }

                                textureMap.originOffset = [ u, v, w ];
                            }
                            else
                                isValid                 = false;
                            break;
                        case '-s':
                            /* 
                             * NOTE(Dino):
                             * This command has one mandatory and two optional arguments.
                             * The mandatory argument is a single 'u' modifier.
                             * The rest are optional 'v' and 'w' modifiers.
                             * All three are arbitrary floating-point numbers.
                             */
                            var u                       = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx ] ], 0 );
                            if ( !isNaN ( u ) )
                            /* 
                             * NOTE(Dino): 
                             * If the text is ill-formed, the value for the mandatory parameter 
                             * will be missing, or at least it will not be a floating-point number.
                             */
                            {
                                /* NOTE(Dino): the default value for missing optionals is 0. */
                                var v                   = 1.0;
                                var w                   = 1.0;

                                /* 
                                 * Peek at the next token and determine whether it's an optional floating-point param.
                                 * If so, pop it and go at the next one. 
                                 */
                                var pV                  = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx + 1 ] ], 0 );
                                if ( !isNaN ( pV ) )
                                {
                                    v                   = pV;
                                    currTokenIdx++;
                                    var pW              = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx + 1 ] ], 0 );
                                    if ( !isNaN ( pW ) )
                                    {
                                        w               = pW;
                                        currTokenIdx++;
                                    }
                                }

                                textureMap.scale        = [ u, v, w ];
                            }
                            else
                                isValid                 = false;
                            break;
                        case '-t':
                        /* 
                             * NOTE(Dino):
                             * This command has one mandatory and two optional arguments.
                             * The mandatory argument is a single 'u' coefficient.
                             * The rest are optional 'v' and 'w' coefficients.
                             * All three are arbitrary floating-point numbers.
                             */
                            var u                       = wavefront.parseSingleFloat ( [ tokens [ currTokenIdx ] ], 0 );
                            if ( !isNaN ( u ) )
                            /* 
                             * NOTE(Dino): 
                             * If the text is ill-formed, the value for the mandatory parameter 
                             * will be missing, or at least it will not be a floating-point number.
                             */
                            {
                                /* NOTE(Dino): the default value for missing optionals is 0. */
                                var v                   = 0.0;
                                var w                   = 0.0;

                                /* 
                                 * Peek at the next token and determine whether it's an optional floating-point param.
                                 * If so, pop it and go at the next one. 
                                 */
                                var pV                  = tokens[ currTokenIdx + 1 ];
                                pV                      = wavefront.parseSingleFloat ( [ pV ], 0 );
                                if ( !isNaN ( pV ) )
                                {
                                    v                   = pV;
                                    currTokenIdx++;
                                    var pW              = tokens[ currTokenIdx + 1];
                                    pV                  = wavefront.parseSingleFloat ( [ pV ], 0 );
                                    if ( !isNaN ( pW ) )
                                    {
                                        w               = pW;
                                        currTokenIdx++;
                                    }
                                }

                                textureMap.turbulence   = [ u, v, w ];
                            }
                            else
                                isValid                 = false;
                            break;
                        case '-texres':
                            /*
                             * NOTE(Dino):
                             * The -texres option specifies the resolution of texture created 
                             * when an image is used. 
                             * The default texture size is the largest power of two 
                             * that does not exceed the original image size.
 
                              * If the source image is an exact power of 2, 
                              * the texture cannot be built any larger. 
                              * If the source image size is not an exact power of 2, you 
                                can specify that the texture be built at the next power of 2 greater 
                              * than the source image size.
 
                              * The original image should be square, otherwise, it will be scaled 
                              * to fit the closest square size not larger than the original.  
                              * Scaling reduces sharpness.
                              */
                              value                             = wavefront.parseSingleInt ( [ tokens [ currTokenIdx ] ], 0 );
                              if ( !isNaN ( value ) )
                              {
                                  textureMap.textureResolution  = value;
                              }
                              else
                                isValid                         = false;
                            break;
                        case 'clamp':
                            if ( value === "on" )
                                textureMap.clamp = true;
                            else if ( value === "off" )
                                textureMap.clamp                = false;
                            else
                                isValid                         = false;
                            break;
                        case '-bm':
                            value                               = wavefront.parseSingleFloat (  [ tokens [ currTokenIdx ] ], 0 );
                            if ( !isNaN ( value ) )
                                textureMap.bumpMultiplier       = value;
                            else
                                isValid                         = false;
                            break;
                        case '-imfchan':
                            if ( value === 'r' || value === "g" || value === "b" || value === "m" || value === "l" || value === "z" )
                                textureMap.channel              = value;
                            else
                                isValid                         = false;
                            break;
                        default:
                            /* Extra parameter cases we don't support. */
                            break;
                    }
                }
                else if ( token.charAt ( 0 ) === '#' )
                {
                    /*
                     * NOTE(Dino):
                     * Have we discovered the name of the texture map yet?
                     * If not, then it cannot be legally present.
                     * Thus, the texture would be incomplete.
                     */
                    if ( nameCandidate === null )
                        isValid                                 = false;
                }
                else
                /* Process the texture name. Parameters cannot follow afterwards, as per the .mtl specification. */
                {
                    nameCandidate                               = tokens[ currTokenIdx ];
                    if ( wavefront.containsComment ( nameCandidate ) )
                    /* We're done processing. The rest of the line is inconsequential, for it is a comment. */
                    {
                        textureMap.name                         = wavefront.trimComment ( nameCandidate );
                        currTokenIdx                            = tokens.length; // This will terminate the loop at the next iteration.
                    }
                    else
                    /* 
                     * NOTE(Dino):
                     * There are two cases to consider.
                     
                     * The first one is a case in which this is the last token in the string.
                     * In this case, there is no more work to be done and we can close shop.
                     * 
                     * If there are other tokens remaining, then there are also two cases to consider.
                     * Either the remainder of the string is a comment and may thus be ignored, or
                     * it is not a comment and is something else entirely.
                     * Things cannot, however, follow the name of a texture in a texture map declaration.
                     * This is illegal according to the .mtl specification by Wavefront.
                     */
                    {
                        if ( currTokenIdx !== ( tokens.length - 1 ) && !wavefront.containsComment ( tokens[ currTokenIdx + 1 ] ) )
                            isValid         = false;
                        else
                            textureMap.name = tokens[ currTokenIdx ];
                    }
                }
            }
        }

        return ( isValid ? textureMap : null );
    }

    function loadMaterialFromString ( string )
    {

        var isFileValid             = true;
        var materials               = [ ];
        var currMaterial            = null;
       
        string                      = string.replace(/  +/g, ' ');
        var lines                   = string.split ( '\n' );
        for ( var currLineIdx       = 0; currLineIdx < lines.length; currLineIdx++ )
        {
            var currLine            = lines[ currLineIdx ].trim ( );
            if ( currLine.length === 0 )
                continue;
            var tokens              = currLine.split( ' ' );
            switch ( tokens[ 0 ] )
            {
                /* TODO: iterate every word starting from idx 1 and fill up the object. */
                case "Ka":
                    /*
                     * NOTE(Dino):
                     * The 'Ka' statement declares the material's ambient colour.
                     * This colour is specified in RGB format, where each channel's value 
                     * is a member of the range [0, 1].
                     * The line can, therefore, be either valid if it contais 
                     * all three values in the specific range, 
                     * or invalid if it contains less or more than three values,
                     * or if any values are outside of this range.
                     * 
                     * Possible input combinations:
                     * Ka 1.0 1.0 1.0 # A valid combination.
                     * Ka 1.0 1.0 # An invalid combination containing less than three values.
                     * Ka 1.0 1.0 1.0 1.0  # An invalid combination containing more than three values.
                     * Ka 1.0 1.0 442 # An invalid combination containing the right number of values, but at least one which falls outside of the required range.
                     */
                    var colour      = wavefront.parseRGB ( tokens, 1 );
                    if ( colour !== null )
                    {
                        if ( currMaterial !== null )
                            currMaterial.ambient    = colour;
                        else
                            isFileValid             = false;
                    }
                    else
                        isFileValid                 = false;
                    break;
                case "Kd":
                    /*
                     * NOTE(Dino):
                     * The 'Kd' statement declares the material's diffuse colour.
                     * This colour is specified in RGB format, where each channel's value
                     * is a member of the range [0.0, 1.0]. 
                     * 
                     * Same rules apply as in the 'Ka' statement.
                     */
                    var colour                      = wavefront.parseRGB ( tokens, 1 );
                    if ( colour !== null )
                    {
                        if ( currMaterial !== null )
                            currMaterial.diffuse    = colour;
                        else
                            isFileValid             = false;
                    }
                    else
                        isFileValid                 = false;
                    break;
                case "Ks":
                    /*
                     * NOTE(Dino):
                     * The 'Ks' statement declares the material's specular highlight colour.
                     * This colour is specified in RGB format, where each channel's value
                     * is a member of the range [0.0, 1.0]. 
                     * 
                     * Same rules apply as in the 'Ka' statement.
                     */
                    var colour                      = wavefront.parseRGB ( tokens, 1 );
                    if ( colour !== null )
                    {
                        if ( currMaterial !== null )
                            currMaterial.specular   = colour;
                        else
                            isFileValid             = false;
                    }
                    else
                        isFileValid                 = false;
                    break;
                case "Ns":
                    /* 
                     * NOTE(Dino):
                     * This statement describes the material's specular coefficient modifier, 
                     * e.g shininess.
                     * This is used in tandem with the specular highlight colour, 
                     * and is used in the shading equation.
                     * The specular coefficient is calculated as 2 to the power of Ns.
                     * 
                     * It is a single integer coefficient, ranging in [0, 1000]. 
                     */
                    var specularCoefficient         = wavefront.parseSingleFloat ( tokens, 1 );
                    if ( !isNaN ( specularCoefficient ) )
                    {
                        if ( currMaterial !== null )
                            currMaterial.shininess = specularCoefficient;
                        else
                            isFileValid             = false;
                    }
                    else
                        isFileValid                 = false;
                    break;
                case "d":
                    /*
                     * NOTE(Dino):
                     * This statement describes the material's dissolve.
                     * A 'dissolve' coefficient describes how much of the object
                     * does not blend into the surrounding scene.
                     * It is, in essence, the reverse of a 'transparency' coefficient
                     * and is equivalent to an 'alpha' coefficient.
                     * 
                     * It is a single floating-point coefficient, ranging in [0.0, 1.0]. 
                     */
                    var dissolve                    = wavefront.parseSingleFloat ( tokens, 1 );
                    if ( !isNaN ( dissolve ) && ( dissolve >= 0.0 && dissolve <= 1.0 ) )
                    {
                        if ( currMaterial !== null )
                            currMaterial.dissolve   = dissolve;
                        else
                            isFileValid             = false;
                    }
                    else
                        isFileValid                 = false;
                    break;
                case "Tr":
                    /*
                     * NOTE(Dino):
                     * This statement describes the material's transparency coefficient.
                     * A 'transparency' coefficient describes how much of the object
                     * blends into the surrounding scene.
                     * It is, in essence, the reverse of an 'alpha' or 'opacity'.
                     * 
                     * It is a single floating-point coefficient, ranging in [0.0, 1.0]. 
                     */
                    var transparency                = wavefront.parseSingleFloat ( tokens, 1 );
                    if ( !isNaN ( transparency ) && ( transparency >= 0.0 && transparency <= 1.0 ) )
                    {
                        if ( currMaterial !== null )
                        {
                            var dissolve            = ( 1.0 - transparency );
                            currMaterial.dissolve   = dissolve; 
                        }
                        else
                            isFileValid             = false;
                    }
                    break;
                case "map_Ka":
                    var ambientTextureMap           = parseTextureMap ( tokens, 1 );
                    if ( ambientTextureMap !== null )
                        currMaterial.ambientMap     = ambientTextureMap;
                    else
                        isFileValid                 = false;
                    break;
                case "map_Kd":
                    var diffuseTextureMap           = parseTextureMap ( tokens, 1 );
                    if ( ambientTextureMap !== null )
                        currMaterial.diffuseMap     = diffuseTextureMap;
                    else
                        isFileValid                 = false;
                    break;
                case "map_Ks":
                    var specularMap                 = parseTextureMap ( tokens, 1 );
                    if ( specularMap !== null )
                        currMaterial.specularMap    = specularMap;
                    else
                        isFileValid                 = false;
                    break;
                case "map_d":
                    var alphaMap                    = parseTextureMap ( tokens, 1 );
                    if ( alphaMap !== null )
                        currMaterial.alphaMap       = alphaMap;
                    else
                        isFileValid                 = false;
                    break;
                case "bump":
                case "map_bump":
                    var bumpMap                     = parseTextureMap ( tokens, 1 );
                    if ( bumpMap !== null )
                        currMaterial.bumpMap        = bumpMap;
                    else
                        isFileValid                 = false;
                    break;
                case "newmtl":
                    if ( currMaterial !== null )
                        this.materials.push ( currMaterial );
                    /* 
                     * NOTE(Dino):
                     * There are two options regarding this statement:
                     * it either contains a valid material name, or does not.
                     * If it does, then the name is the first word in the list after the statement,
                     * e.g it is at position 1.
                     * Else, it contains a comment at that very same position.
                     */
                    var trimmed                 = wavefront.trimComment ( tokens[ 1 ] );
                    if ( trimmed.length > 0 )
                        currMaterial            = new Material ( trimmed );
                    break;
            }
        }

        if ( currMaterial !== null ) {
            var exportableCurrMaterial = toExportableMaterial(currMaterial);
            materials.push ( exportableCurrMaterial );
        }
            

        return isFileValid ? materials : null;
    }

    renderPro.importers.loadMaterialFromMaterialFile = loadMaterialFromString;


    /* * * * * * * * * * * * * * * * * */
    /*            Unit tests           */
    /*                                 */
    /* * * * * * * * * * * * * * * * * */

    function parseSingleFloatUnitTest ( )
    {
        var isTestSuccessful         = true;
        
        var input                    = "12.0";
        var expectedOutput           = 12.0;
        var realizedOutput           = wavefront.parseSingleFloat ( [ input ], 0  );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                        = "12";
        realizedOutput               = wavefront.parseSingleFloat ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                        = "12.";
        realizedOutput               = wavefront.parseSingleFloat ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                        = "-12.0";
        expectedOutput               = - 12.0;
        realizedOutput               = wavefront.parseSingleFloat ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                        = "0.12";
        expectedOutput               = 0.12;
        realizedOutput               = wavefront.parseSingleFloat ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        Application.Debug.assert ( isTestSuccessful );
        return isTestSuccessful;
    }

    function parseSingleIntUnitTest ( )
    {
        var isTestSuccessful        = true;

        var input                   = "12";
        var expectedOutput          = 12;
        var realizedOutput          = wavefront.parseSingleInt ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                       = "12.0";
        realizedOutput              = wavefront.parseSingleInt ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        input                       = "-12";
        expectedOutput              = -12;
        realizedOutput              = wavefront.parseSingleInt ( [ input ], 0 );
        Application.Debug.assert ( isTestSuccessful &= ( expectedOutput === realizedOutput ), "Unit test failed: conversion improper." );

        Application.Debug.assert ( isTestSuccessful );
        return isTestSuccessful;
    }

    function parseRGBUnitTest ( )
    {
        var isTestSuccessful        = true;

        var input                   = [ "1.0", "1.0", "1.0" ];
        var expectedOutput          = { red: 1.0, green: 1.0, blue: 1.0 };
        var realizedOutput          = wavefront.parseRGB ( input, 0 );
        Application.Debug.assert ( isTestSuccessful &= colourComparer ( expectedOutput, realizedOutput ) );

        Application.Debug.assert ( isTestSuccessful );
        return isTestSuccessful;
    }

    function parseTextureMapUnitTest ( )
    {
        var isTestSuccessful        = true;
        
        var inputString             = "bump -imfchan r -bm 2 -texres 256 -mm 1 1 nehe.gif";
        var input                   = inputString.split ( ' ' );

        var realizedOutput          = parseTextureMap ( input, 1 );
        
        isTestSuccessful            &= ( realizedOutput != null );
        Application.Debug.assert ( isTestSuccessful, "Test failed: map not parsed." );
        
        isTestSuccessful            &= ( realizedOutput.base == 1 );
        Application.Debug.assert  ( isTestSuccessful, "Base value invalid." );
        
        isTestSuccessful            &= ( realizedOutput.gain == 1.0 );    
        Application.Debug.assert ( isTestSuccessful, "Gain value invalid." );

        isTestSuccessful            &= ( realizedOutput.blendU == true );
        Application.Debug.assert ( isTestSuccessful, "BlendU value invalid." );

        isTestSuccessful            &= ( realizedOutput.blendV == true );
        Application.Debug.assert ( isTestSuccessful, "BlendV value invalid." );

        isTestSuccessful            &= ( realizedOutput.clamp == false );
        Application.Debug.assert ( isTestSuccessful, "Clamp value invalid." );

        isTestSuccessful            &= ( realizedOutput.channel == "r" );
        Application.Debug.assert ( isTestSuccessful, "Channel value invalid." );
        
        isTestSuccessful            &= ( realizedOutput.bumpMultiplier == 2.0 );
        Application.Debug.assert ( isTestSuccessful, "Bump multiplier value invalid." );

        isTestSuccessful            &= ( realizedOutput.boostMipMapSharpness == 0 );
        Application.Debug.assert ( isTestSuccessful, "boostMipMapSharpness invalid." );

        isTestSuccessful            &= ( realizedOutput.name == "nehe.gif" );
        Application.Debug.assert ( isTestSuccessful, "Texture map name invalid." );

        Application.Debug.assert ( isTestSuccessful );
        return isTestSuccessful;
    }

    function loadMaterialFromStringUnitTest ( )
    {
        var isTestSuccessful        = true;

        var string                  = "newmtl crate_material\n Ka 1.0 1.0 1.0\n Kd 1.0 1.0 1.0\n Ks 1.0 1.0 1.0\n Ns 36.0\n map_Kd crate.gif\n";
        
        var defaultColour           = { red: 1.0, green: 1.0, blue: 1.0 };
        var material                = loadMaterialFromString ( string )[ 0 ];
        
        isTestSuccessful            &= ( material !== null );
        Application.Debug.assert ( isTestSuccessful, "Material not parsed." );

        isTestSuccessful            &=  ( material.name === "crate_material" );
        Application.Debug.assert ( isTestSuccessful, "Material name invalid." );

        isTestSuccessful            &= ( colourComparer ( material.ambient, defaultColour ) );
        Application.Debug.assert ( isTestSuccessful, "Material ambient colour invalid." );

        isTestSuccessful            &= ( colourComparer ( material.diffuse, defaultColour ) );
        Application.Debug.assert ( isTestSuccessful, "Material diffuse colour invalid." );

        isTestSuccessful            &= ( colourComparer ( material.specular, defaultColour ) );
        Application.Debug.assert ( isTestSuccessful, "Material specular colour invalid." );

        isTestSuccessful            &= ( material.shininess === 36 );
        Application.Debug.assert ( isTestSuccessful, "Material shininess invalid." );

        isTestSuccessful            &= ( material.diffuseMap != undefined );
        Application.Debug.assert ( isTestSuccessful, "Material diffuse texture map missing." );

        isTestSuccessful            &= ( material.diffuseMap.name == "crate.gif" );
        Application.Debug.assert ( isTestSuccessful, "Material diffuse texture map path invalid." );

        Application.Debug.assert ( isTestSuccessful, "Test failed!" );
        return isTestSuccessful;
    }

    ( function testRunner ( ) 
    {
        var testSuccessful          = true;

        testSuccessful              &= parseSingleFloatUnitTest ( );
        testSuccessful              &= parseSingleIntUnitTest ( );
        testSuccessful              &= parseRGBUnitTest ( );
        testSuccessful              &= parseTextureMapUnitTest ( );
        testSuccessful              &= loadMaterialFromStringUnitTest ( );

        Application.Debug.assert ( testSuccessful );
     } ) ( ); /// META(Build): test runner.
} ) ( );