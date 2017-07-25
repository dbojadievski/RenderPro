namespace Application 
{
    export namespace Infrastructure 
    {
        export namespace CommandConsole
        {
            export class Console 
            {
                private commands:       Array<Command> 
                private queue:          Array<CommandData>
                private eventSystem:    ProEventSystem
                constructor ( eventSystem: ProEventSystem )
                {
                    // Application.Debug.assert ( isValidReference ( eventSystem ) );
                    this.commands       = new Array<Command> ( );
                    this.eventSystem    = eventSystem;
                    this.queue          = new Array<CommandData> ( );
                    
                    /* This is a test command added. */
                    let commandString   = "addIntegers";
                    let commparams      = new Array<CommandParameter> ( );
                    commparams.push ( new CommandParameter ( "param1", CommandParameterType.INTEGER ) );
                    commparams.push ( new CommandParameter ( "param2", CommandParameterType.INTEGER ) );
                    let handler         = function ( args )
                    {
                        let parsedParameters = this.parseParameters ( args, this.parameters, this.parameters.length );
                        const paramA: number = parsedParameters[ 0 ];
                        const paramB: number = parsedParameters[ 1 ];

                        const result: number = ( paramA + paramB );
                        console.log ( "Executed command addIntegers from new console!" );
                    };

                    let command         = new Command ( commandString, commparams, handler );
                    this.commands.push ( command );
                }

                hasCommandQueued ( ) : boolean
                {
                    const retVal                = ( this.queue.length != 0 );
                    return retVal;
                }

                shouldKickstart ( ) : boolean
                {
                    const retVal                = ( this.queue.length === 1 );
                    return retVal;
                }

                cleanUpAfterExecution ( ) : void
                {
                    this.queue                  = this.queue.slice ( 1 );
                }

                executeCommand ( commandString: string, noPropagation: boolean = true )
                {
                    // Application.Debug.assert ( isValidReference ( commandString ) );
                    // Application.Debug.assert ( commandString.length != 0 );

                    const tokens                = commandString.split ( ' ' );
                    if ( tokens.length > 0 )
                    {
                        let commandName         = tokens[ 0 ];
                        let commandIndex        = -1;
                        let command: Command    = null;
                        for ( let currCommandIndex = 0; currCommandIndex < this.commands.length; currCommandIndex++ )
                        {
                            let currCommand     = this.commands[currCommandIndex ];
                            if ( currCommand.name === commandName )
                            {
                                commandIndex    = currCommandIndex;
                                command         = currCommand;
                            }
                        }

                        if ( commandIndex != -1 )
                        {
                            if ( isValidReference ( command ) )
                                command.execute ( tokens.slice ( 1 ) );

                            if ( !noPropagation )
                                 this.eventSystem.fire( 'commandExecutedOnHost' , commandString );

                            this.eventSystem.fire ( 'commandExecuted' );
                        }
                    }
                }

                parseCommand ( commandString: string, noPropagation: boolean = true )
                {
                    commandString               = commandString.trim ( );
                    let commandData             = new CommandData ( commandString, noPropagation );
                    this.queue.push ( commandData );

                    this.eventSystem.fire ( 'commandQueued' );
                }
            }
        }
    }
}