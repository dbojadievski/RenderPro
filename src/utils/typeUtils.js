/**
 * @author @bojadjievski
 */

function isInt( data )
{
    return ( typeof ( data ) === 'number' && ( ( data % 1 ) === 0 ) );
}

function isFloat( data )
{
    return ( typeof ( data ) === 'number' && ( data === 0 || ( data % 1 !== 0 ) ) );
}

function isNumber( data )
{
    return ( isInt( data ) || isFloat( data ) );
}

function isByte( data )
{
    return ( isInt( data ) && ( data >= 0 && data <= 255 ) )
}

function isString( data )
{
    return ( typeof ( data ) === 'string' );
}

function isBoolean( data )
{
    return ( typeof ( data ) === 'boolean' );
}

function isTruthfulness( data )
{
    return ( isBoolean ( data ) || ( data === 1 || data === 0 ) );
}

function isArray( data )
{
    return Object.prototype.toString.call( data ) === '[object Array]';
}

function isFunction( functionToCheck )
{
    var getType                                             = {};
    return functionToCheck && getType.toString.call( functionToCheck ) === '[object Function]';
}

function isObject( data )
{
    return ( data != null && typeof ( data ) === 'object' );
}

function isNumber( data )
{
    return ( !isNaN( data ) && ( isInt( data) || isFloat( data ) )  );
}

function isUndefined( data )
{
    return ( typeof(data) == 'undefined' );
}

function isInvalidReference( data )
{
    return ( isUndefined( data ) || data === null );
}

function isValidReference( data )
{
    return ( !isUndefined( data ) && data !== null );
}

var isNullPtr = isInvalidReference; // Use whichever you'd like.

function assert( data, condition, message )
{
    if ( !isTruthfulness( condition ) && !isFunction( condition ) )
        throw "Condition must be a function evaluating to either true or false.";
    if ( ( isFunction( condition ) && !condition( data ) ) || !condition )
        throw message;
}