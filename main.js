var publicScene;
var eventSystem                         = new Application.Infrastructure.ProEventSystem( );
var g_OpenGLContext;

( function ()
{
    var engine                          = new renderPro.core.Engine ( assets );
    engine.init ( );
    engine.start ( );
})()