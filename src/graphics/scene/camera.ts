namespace renderPro {
    export namespace graphics {
        export namespace scene {
            export class Camera {
                position : any
                viewDirection : any
                constructor ( position : any, viewDirection : any )
                {
                    this.position               = position;
                    this.viewDirection          = viewDirection;
                }
                getViewMatrix ( worldUp : any ) : any
                {
                    var viewMatrix              =  renderPro.math.gl.Mat4.create ( );
                    
                    var lookAtPoint             = 
                    [ 
                        this.position[ 0 ] + this.viewDirection[ 0 ], 
                        this.position[ 1 ] + this.viewDirection[ 1 ],
                        this.position[ 2 ] + this.viewDirection[ 2 ] 
                    ];

                    viewMatrix                  =  renderPro.math.gl.Mat4.lookAt (  renderPro.math.gl.Mat4.create ( ), this.position, lookAtPoint, worldUp );
                    return viewMatrix;
                };

            } 
        }
    }
}
