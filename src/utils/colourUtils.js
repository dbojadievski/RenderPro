function colourComparer ( a, b )
{
    return ( a.red === b.red && a.green === b.green && a.blue === b.blue );
}

function exportableColourComparer ( a, b )
{
    return ( a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]);
}