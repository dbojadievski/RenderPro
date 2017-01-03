( function ( ) 
{
    function assert ( expression, message )
    {
        if ( !expression )
            throw message !== undefined ? message : "ASSERTION INVALID; TERMINATING EXECUTION.";
    }

    Application.Debug.assert = assert;
} ) ( );