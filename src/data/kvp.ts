class KeyValuePair<T,U> 
{
    key: T;
    value: U;
    constructor ( key : T, value : U )
    {
        this.key        = key;
        this.value      = value;
    }
}

class Dictionary<T,U> 
{
    content : Array<KeyValuePair<T,U>>;
    constructor ()
    {
        this.content = new Array<KeyValuePair<T,U>>();
    }
    hasKey ( key : T ) : boolean
    {
        let isKeyFound : boolean        = false;
        for ( let currKeyIdx : number   = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].key == key )
            {
                isKeyFound              = true;
                break;
            }
        }

        return isKeyFound;
    }
    hasValue ( value : U ) : boolean
    {
        let isValueFound : boolean      = false;
        for ( let currKeyIdx : number   = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].value === value )
            {
                isValueFound            = true;
                break;
            }
        }

        return isValueFound;
    }
    getByKey ( key : T ) : U
    {
        let value : U                   = null;
        for ( let currKeyIdx : number   = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].key == key )
            {
                value           = this.content [ currKeyIdx ].value;
                break;
            }
        }

        return value;
    }
    push ( kvp : KeyValuePair<T,U> ) : void
    {
        this.content.push ( kvp );
    }
    length ( ) : number
    {
        return this.content.length;
    }
    iterate ( callback : Function ) : void
    { 
        for ( let currIdx : number = 0; currIdx < this.content.length; currIdx++ )
            callback ( this.content[ currIdx ] );
    }
}




