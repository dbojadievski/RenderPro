namespace renderPro {
    export namespace data {
        export namespace scene {
            export class SceneNode {
                parent: SceneNode
                children: Array<SceneNode>
                preXYZ: Float32Array
                prePYR: Float32Array
                transform: Float32Array
                cachedTransform: Float32Array
                constructor ( parent : SceneNode )
                {
                    this.parent                 = parent;
                    this.children               = [ ];

                    this.preXYZ                 = vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.prePYR                 = vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.transform              = mat4.create();
                    mat4.identity ( this.transform );
                    this.cachedTransform        = mat4.create();

                    if ( parent instanceof SceneNode )
                        parent.addChild ( this );
                }
                addChild ( child : SceneNode ) : void
                {
                    Application.Debug.assert ( child instanceof SceneNode, "Invalid argument: arg 'child' not an instance of SceneNode." );
                    this.children.push ( child );
                    child.parent                = this;
                };
                /*
                * Updates only this node's transformation matrix, based on the pre-transform values.
                * It resets the pre-transform values to the defaults afterwards.
                * Note(Dino):
                * The defaults are nil vectors.
                */
                updateLocal ( ) : void
                {
                    mat4.rotateX ( this.transform, this.transform, this.prePYR[ 2 ] );
                    mat4.rotateY ( this.transform, this.transform, this.prePYR[ 1 ] );
                    mat4.rotateZ ( this.transform, this.transform, this.prePYR[ 0 ] );
                    mat4.translate ( this.transform, this.transform, this.preXYZ );
                    this.prePYR[ 0 ]            = 0.0;
                    this.prePYR[ 1 ]            = 0.0;
                    this.prePYR[ 2 ]            = 0.0;
                    this.preXYZ[ 0 ]            = 0.0;
                    this.preXYZ[ 1 ]            = 0.0;
                    this.preXYZ[ 2 ]            = 0.0;

                    this.cachedTransform        = this.computeTransform ( );
                }
                computeTransform ( )  :  Float32Array
                {
                    let finalTransform          = mat4.create ( );
                    mat4.identity ( finalTransform );
                    mat4.multiply ( finalTransform, finalTransform, this.transform );
                    
                    let parent : SceneNode      = this.parent;
                    while ( parent !== null )
                    {
                        mat4.multiply(  finalTransform, finalTransform, parent.transform );
                        parent                  = parent.parent;
                    }
                    
                    return finalTransform;
                }
                updateAll ( ) : void
                {
                    this.updateLocal ( );
                    for ( let currChildIdx = 0; currChildIdx < this.children.length; currChildIdx++ )
                        this.children[ currChildIdx ].updateAll ( );       
                };
            }
        }
    }
}