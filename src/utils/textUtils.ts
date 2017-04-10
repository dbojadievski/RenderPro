namespace renderPro {
    export namespace utils {
        export namespace text {
            export namespace wavefront {
                export function trimComment ( token : string ) : string
                {
                    Application.Debug.assert ( token !== null && token !== undefined, "Param not supplied." ); 
                    return token.split( '#' )[ 0 ].trim ( );
                }
                export function containsComment ( token : string ) : boolean
                {
                    Application.Debug.assert ( token !== undefined && token !== null, "Param not supplied." );
                    return ( token.indexOf ( '#' ) !== -1 );
                }
                export function parseRGB ( tokens : Array<string>, startIdx : number ) : object
                {
                    Application.Debug.assert ( tokens !== null && tokens !== undefined, "Param not supplied." );
                    Application.Debug.assert ( tokens instanceof Array, "Param not of type 'Array'." );

                    let colour : object               =  { };
                    if ( tokens.length >= ( startIdx + 3 ) )
                    {
                        var red : string | number              = tokens[ startIdx ];
                        var green : string | number            = tokens[ startIdx + 1 ];
                        var blue  : string | number            = tokens[ startIdx + 2 ];

                        red                   = Number ( red );
                        if ( !isNaN ( red ) )
                            red               = ( red >= 0 && red <= 1 ) ? red : NaN;
                        green                 = Number ( green );
                        if ( !isNaN ( green ) )
                            green             = ( green >= 0 && green <= 1 ) ? green : NaN;
                        
                        blue                  = Number ( blue );
                        if ( !isNaN ( blue ) )
                            blue              = ( blue >= 0 && blue <= 1 ) ? blue : NaN;
                        
                        if ( isNaN ( red ) || isNaN ( green ) || isNaN ( blue ) )
                            colour            = null;
                        else
                        {
                            colour            = { red, green, blue }
                        }
                    }

                    return colour;
                }
                export function parseSingleFloat ( tokens : Array<string>, startIdx : number ) : number
                {
                    Application.Debug.assert ( tokens !== null && tokens !== undefined, "Param not supplied." );
                    Application.Debug.assert ( tokens instanceof Array, "Param not of type 'Array'." );

                    let float : number          = NaN;
                    if ( tokens.length >= ( startIdx + 1 ) )
                    {
                        let candidate : string  = tokens[ startIdx ];
                        float                   = Number ( candidate );
                        
                        /* Is there a next word? If so, does it contain anything but a comment? */
                        if ( tokens.length > ( startIdx + 1 ) )
                            float               = ( tokens[ startIdx + 1 ].charAt ( 0 ) === '#' ) ? float : NaN;
                    }

                    return float;
                }
                export function parseSingleInt ( tokens : Array<string>, startIdx : number ) : number
                {
                    Application.Debug.assert ( tokens !== null && tokens !== undefined, "Param not supplied." );
                    Application.Debug.assert ( tokens instanceof Array, "Param not of type 'Array'." );

                    var int : number            = NaN;
                    if ( tokens.length >= ( startIdx + 1 ) )
                    {
                        var candidate : string  = tokens[ startIdx ];
                        int                     = Number ( candidate );
                        /* Is there a next word? If so, does it contain anything but a comment? */
                        if ( tokens.length > ( startIdx + 1 ) )
                            int             = (tokens[ startIdx + 1 ].charAt ( 0 ) === '#')  ? Math.round(int) : NaN;
                    }

                    return int;
                }
            }
        }
    }
}