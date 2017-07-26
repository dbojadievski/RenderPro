var publicScene;
var eventSystem                         = new Application.Infrastructure.ProEventSystem( );
var g_OpenGLContext;

( function ()
{
    var engine                          = new renderPro.core.Engine ( assets );
    
    Application.Systems.eventSystem.on ( 'commandQueued',  function ( args ) 
    { 
        if ( Application.Systems.console.shouldKickstart ( ) )
            Application.Systems.console.executeNextCommand();
    } );

    Application.Systems.eventSystem.on( 'commandExecuted', function ( )
    {
        Application.Systems.console.cleanUpAfterExecution ( );
        if ( Application.Systems.console.hasCommandsQueued ( ) )
            Application.Systems.console.executeNextCommand ( );
    } );

    engine.init ( );
    engine.start ( );
})()