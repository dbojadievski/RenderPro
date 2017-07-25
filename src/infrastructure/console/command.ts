namespace Application 
{
    export namespace Infrastructure 
    {
        export namespace CommandConsole
        {
            export enum CommandParameterType
            {
                INTEGER,
                REAL,
                BOOLEAN,
                STRING,
                ARRAY
            }
            
            export class CommandData
            {
                command:        string
                doNotPropagate: boolean

                constructor ( command: string, doNotPropagate: boolean )
                {
                    this.command        = command;
                    this.doNotPropagate = doNotPropagate;
                }
            }

            export class CommandParameter
            {
                name:       string
                type:       CommandParameterType

                constructor ( name: string, type: CommandParameterType )
                {
                    // Application.Debug.assert ( isValidReference ( name ) );
                    // Application.Debug.assert ( name.length != 0 );
                    // Application.Debug.assert ( isValidReference ( type ) );

                    this.name       = name;
                    this.type       = type;
                }
            }

            export class CommandParameterV extends CommandParameter
            {
                value: any

                constructor ( name: string, type: CommandParameterType, value: any )
                {
                    super ( name, type );
                    this.value      = value;
                }
            }

            export class Command 
            {
                name:       string
                handler:    Function
                parameters: Array<CommandParameter>

                constructor ( name: string, parameters: Array<CommandParameter>, handler: Function )
                {
                    // Application.Debug.assert ( isValidReference ( name ) );
                    // Application.Debug.assert ( name.length != 0 );
                    // Application.Debug.assert ( isValidReference ( handler ) );
                    // Application.Debug.assert ( isValidReference ( parameters ) );

                    this.name       = name;
                    this.parameters = parameters;
                    this.handler    = handler;
                }

                execute ( args: any ) : void
                {
                    this.handler ( args );
                }

                parseParameter ( proto: CommandParameter, string: string ) : CommandParameterV
                {
                    let retVal: CommandParameterV   = undefined;

                    let parsedValue: any            = undefined;
                    let isParamValid: boolean       = true;

                    let isNAN:boolean               = false;
                    switch ( proto.type )
                    {
                        case CommandParameterType.INTEGER:
                            parsedValue             = parseInt ( string );
                            isNAN                   = isNaN ( parsedValue );
                            if ( isNAN )
                                isParamValid        = false;
                            break;
                        case CommandParameterType.REAL:
                            parsedValue             = parseFloat ( string );
                            isNAN                   = isNaN ( parsedValue );
                            if ( isNAN )
                                isParamValid        = false;
                            break;
                        case CommandParameterType.BOOLEAN:
                            let toLower             = string.toLowerCase ( );
                            parsedValue             = ( toLower == 'true' );
                            break;
                        case CommandParameterType.ARRAY:
                            parsedValue             = string.split ( ',' );
                            break;
                        default:
                            isParamValid            = false;
                            break;
                    }

                    if ( isParamValid )
                        retVal                      = new CommandParameterV ( proto.name, proto.type, parsedValue );

                    return retVal;

                }

                parseParameters ( parameters: Array<string>, commandParameters: Array<CommandParameter>, commandParamsLen: number )
                {
                    // Application.Debug.assert ( isValidReference ( parameters ) );
                    // Application.Debug.assert ( isValidReference ( commandParameters ) );
                    // Application.Debug.assert ( commandParamsLen >= 0 );
                    
                    let parsedParameters: Array<CommandParameterV>  = null;

                    if ( parameters.length == this.parameters.length )
                    {
                        parsedParameters            = new Array ( );
                        for ( let currParamIndex: number = 0; currParamIndex < parameters.length; currParamIndex++ )
                        {
                            let proto: CommandParameter     = this.parameters[ currParamIndex ];
                            let val: string                 = parameters[ currParamIndex ];
                            let param: CommandParameterV    = this.parseParameter ( proto, val );
                            if ( !isUndefined ( param ) )
                                parsedParameters[ currParamIndex ] = param.value;
                            else
                                parsedParameters[ currParamIndex ] = null;
                        }
                    }

                    return parsedParameters;
                }
            }

            /* * * * * * * * * * * * * * * * * * * * * * * */
            /*                 T e s t s                   */
            /* * * * * * * * * * * * * * * * * * * * * * * */
            let paramA                  = new CommandParameter ( 'paramA', CommandParameterType.INTEGER );
            let paramB                  = new CommandParameter ( 'paramB', CommandParameterType.INTEGER );
            let handler                 = function ( a: number, b: number ) : number 
            {
                return ( a + b );
            }
        }
    }
}