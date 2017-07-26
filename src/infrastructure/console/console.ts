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
                    this.commands       = new Array<Command> ( );
                    this.eventSystem    = eventSystem;
                    this.queue          = new Array<CommandData> ( );
                    
                    let self: Console           = this;
                    
                    this.commands.push ( new Command ( "create_entity", [ new CommandParameter ( 'tag', CommandParameterType.STRING ) ], function ( args ) 
                    {
                        const parsedParameters  = this.parseParameters ( args, this.parameters, this.parameters.length );
                        if ( parsedParameters != null )
                            self.eventSystem.fire ( 'shouldCreateEntity', parsedParameters[ 0 ] );
                    } ) );

                    Application.Systems.eventSystem.on ( 'commandQueued',  function ( args ) 
                    { 
                        if ( self.shouldKickstart ( ) )
                            self.executeNextCommand ( );
                    } );

                    Application.Systems.eventSystem.on( 'commandExecuted', function ( )
                    {
                        Application.Systems.console.cleanUpAfterExecution ( );
                        if ( self.hasCommandsQueued ( ) )
                            self.executeNextCommand ( );
                    } );
                }

                hasCommandsQueued ( ) : boolean
                {
                    const retVal                = ( this.queue.length != 0 );
                    return retVal;
                }

                shouldKickstart ( ) : boolean
                {
                    const retVal                = ( this.queue.length === 1 );
                    return retVal;
                }

                executeNextCommand ( ) : void
                {
                    const commandData           = this.queue[ 0 ];
                    this.executeCommand( commandData.command, commandData.doNotPropagate );
                }

                cleanUpAfterExecution ( ) : void
                {
                    this.queue                  = this.queue.slice ( 1 );
                }

                executeCommand ( commandString: string, noPropagation: boolean = true )
                {
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

                        }
                        
                        this.eventSystem.fire ( 'commandExecuted' );
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