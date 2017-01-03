( function ( ) 
{
    function Model ( renderables, transform, parent )
    {
        this.renderables            = renderables;
        this.transform              = transform;
        
        this.parent                 = [ ];
        this.children               = [ ];
        if ( Model._currentModelID == undefined )
            Model._currentModelID   = 1;
        
        this.modelID                = Model._currentModelID++;
    };

    renderPro.graphics.core.Model        = Model;
} ) ( ); 