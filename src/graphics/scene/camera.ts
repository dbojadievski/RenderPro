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
                getViewMatrix ( worldUp : any ) : Float32Array
                {
                    var viewMatrix              =  mat4.create ( );
                    
                    var lookAtPoint             = new Float32Array (
                    [ 
                        this.position[ 0 ] + this.viewDirection[ 0 ], 
                        this.position[ 1 ] + this.viewDirection[ 1 ],
                        this.position[ 2 ] + this.viewDirection[ 2 ] 
                    ]);

                    viewMatrix                  =  mat4.lookAt (  mat4.create ( ), this.position, lookAtPoint, worldUp );
                    return viewMatrix;
                };

            } 
        }
    }
}
