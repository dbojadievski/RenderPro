namespace renderPro 
{
    export namespace graphics 
    {
        export namespace scene 
        {
            export class Camera 
            {
                position: Float32Array
                viewDirection: Float32Array
                constructor ( position: Float32Array, viewDirection: Float32Array )
                {
                    this.position               = position;
                    this.viewDirection          = viewDirection;
                }
                getViewMatrix ( worldUp : Float32Array ) : Float32Array
                {
                    let viewMatrix              =  mat4.create ( );
                    
                    let lookAtPoint             = new Float32Array (
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
