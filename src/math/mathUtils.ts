const PI:number = 3.14159265359;

function degToRad ( deg: number ) : number
{
    return ( deg * ( PI / 180 ) );    
}

function getRandomInRange ( min: number, max: number ) : number
{
    return ( Math.floor ( Math.random ( ) * ( max - min  + 1 ) ) + min );
}

function generateTranslation ( ) : Array<number>
{
    const minX: number    = - 20;
    const maxX: number    = + 20;

    const minY: number    = - 20;
    const maxY: number    = + 20;

    const minZ: number    = -100.0;
    const maxZ: number    = -2.9;

    const x: number       = getRandomInRange ( minX, maxX );
    const y: number       = getRandomInRange ( minY, maxY );
    const z: number       = getRandomInRange ( minZ, maxZ );

    return [ x, y, z ];
}

function generateRotation ( ) : Array<number>
{
    const min: number     = 0.0;
    const max: number     = 359.0;

    const x: number       = getRandomInRange ( min, max );
    const y: number       = getRandomInRange ( min, max );
    const z: number       = getRandomInRange ( min, max );

    return [ x, y, z ];
}