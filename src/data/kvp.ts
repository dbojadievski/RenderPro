class KeyValuePair 
{
    key: any;
    value: any;
    constructor ( key : any, value : any )
    {
        this.key = key;
        this.value = value;
    }
}

class Dictionary 
{
    content : Array<any>;
    constructor ()
    {
        this.content = new Array<any>();
    }
    hasKey ( key : any ) : boolean
    {
        let isKeyFound : boolean         = false;
        for ( let currKeyIdx : number   = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].key == key )
            {
                isKeyFound      = true;
                break;
            }
        }

        return isKeyFound;
    }
    hasValue ( value : any ) : boolean
    {
        let isValueFound : boolean        = false;
        for ( let currKeyIdx : number    = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].value === value )
            {
                isValueFound    = true;
                break;
            }
        }

        return isValueFound;
    }
    getByKey ( key : any ) : any
    {
        let value : any                  = null;
        for ( let currKeyIdx : number    = 0; currKeyIdx < this.content.length; currKeyIdx++ )
        {
            if ( this.content[ currKeyIdx ].key == key )
            {
                value           = this.content [ currKeyIdx ].value;
                break;
            }
        }

        return value;
    }
    push ( kvp : KeyValuePair ) : void
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




