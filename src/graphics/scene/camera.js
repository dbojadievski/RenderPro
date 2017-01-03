( function ( ) 
{
    function Camera ( position, viewDirection )
    {
        this.position               = position;
        this.viewDirection          = viewDirection;
    }

    Camera.prototype.getViewMatrix  = function ( worldUp ) 
    {
        var viewMatrix              = mat4.create ( );
        
        var lookAtPoint             = 
        [ 
            this.position[ 0 ] + this.viewDirection[ 0 ], 
            this.position[ 1 ] + this.viewDirection[ 1 ],
            this.position[ 2 ] + this.viewDirection[ 2 ] 
        ];

        viewMatrix                  = mat4.lookAt ( mat4.create ( ), this.position, lookAtPoint, worldUp );
        return viewMatrix;
    };

    renderPro.graphics.scene.Camera       = Camera;
 } ) ( );
