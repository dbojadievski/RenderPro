( function  ( ) 
{
    function Effect ( vertexShader, fragmentShader, gl )
    {
        this.uniforms               = [ ];
        this.attributes             = [ ];

        this.vertexShader           = vertexShader;
        this.fragmentShader         = fragmentShader;
        
        this.programPointer         = gl.createProgram ( );

        if ( Effect.currentEffectIdx == undefined )
            Effect.currentEffectIdx = 1;
        else
            Effect.currentEffectIdx++;

        this.effectID               = Effect.currentEffectIdx;

        gl.attachShader ( this.programPointer, this.vertexShader );
        gl.attachShader ( this.programPointer, this.fragmentShader );
        gl.linkProgram ( this.programPointer );
    }

    Effect.prototype.use            = function effect_use ( gl )
    {
        gl.useProgram ( this.programPointer );
    };

    renderPro.graphics.Effect    = Effect;
} ) ( );