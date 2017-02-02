function KeyValuePair ( key, value )
{
    this.key                = key;
    this.value              = value;
}

function Dictionary ( )
{
    this.content            = [ ];
}

Dictionary.prototype.hasKey = function dictionary_hasKey ( key )
{
    var isKeyFound          = false;
    for ( var currKeyIdx    = 0; currKeyIdx < this.content.length; currKeyIdx++ )
    {
        if ( this.content[ currKeyIdx ].key == key )
        {
            isKeyFound      = true;
            break;
        }
    }

    return isKeyFound;
};

Dictionary.prototype.hasValue = function dictionary_hasValue ( value )
{
    var isValueFound        = false;
    for ( var currKeyIdx    = 0; currKeyIdx < this.content.length; currKeyIdx++ )
    {
        if ( this.content[ currKeyIdx ].value === value )
        {
            isValueFound    = true;
            break;
        }
    }

    return isValueFound;
};

Dictionary.prototype.getByKey = function dictionary_getByKey ( key )
{
    var value               = null;
    for ( var currKeyIdx    = 0; currKeyIdx < this.content.length; currKeyIdx++ )
    {
        if ( this.content[ currKeyIdx ].key == key )
        {
            value           = this.content [ currKeyIdx ].value;
            break;
        }
    }

    return value;
};

Dictionary.prototype.push   = function dictionary_push ( kvp )
{
    this.content.push ( kvp );
};

Dictionary.prototype.length = function dictionary_length ( )
{
    return this.content.length;
}

Dictionary.prototype.iterate = function dictionary_iterate ( callback )
{
    for ( var currIdx = 0; currIdx < this.content.length; currIdx++ )
        callback ( this.content[ currIdx ] );
}