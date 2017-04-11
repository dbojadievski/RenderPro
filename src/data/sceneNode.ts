namespace renderPro {
    export namespace data {
        export namespace scene {
            export class SceneNode {
                parent: SceneNode
                children: Array<SceneNode>
                preXYZ: any
                prePYR: any
                transform: any
                cachedTransform: any
                constructor ( parent : SceneNode )
                {
                    this.parent                 = parent;
                    this.children               = [ ];

                    this.preXYZ                 = renderPro.math.gl.Vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.prePYR                 = renderPro.math.gl.Vec3.fromValues ( 0.0, 0.0, 0.0 );
                    this.transform              = renderPro.math.gl.Mat4.create();
                    renderPro.math.gl.Mat4.identity ( this.transform );
                    this.cachedTransform        = renderPro.math.gl.Mat4.create();

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
                    renderPro.math.gl.Mat4.rotateX ( this.transform, this.prePYR[ 2 ] );
                    renderPro.math.gl.Mat4.rotateY ( this.transform, this.prePYR[ 1 ] );
                    renderPro.math.gl.Mat4.rotateZ ( this.transform, this.prePYR[ 0 ] );
                    renderPro.math.gl.Mat4.translate ( this.transform, this.preXYZ );
                    this.prePYR[ 0 ]            = 0.0;
                    this.prePYR[ 1 ]            = 0.0;
                    this.prePYR[ 2 ]            = 0.0;
                    this.preXYZ[ 0 ]            = 0.0;
                    this.preXYZ[ 1 ]            = 0.0;
                    this.preXYZ[ 2 ]            = 0.0;

                    this.cachedTransform        = this.computeTransform ( );
                }
                computeTransform ( )  :  renderPro.math.gl.Mat4
                {
                    let finalTransform          = renderPro.math.gl.Mat4.create ( );
                    renderPro.math.gl.Mat4.identity ( finalTransform );
                    renderPro.math.gl.Mat4.multiply ( finalTransform, this.transform );
                    
                    let parent                  = this.parent;
                    while ( parent !== null )
                    {
                        renderPro.math.gl.Mat4.multiply( finalTransform, parent.transform );
                        parent                  = parent.parent;
                    }
                    
                    return finalTransform;
                }
                updateAll ( ) : void
                {
                    this.updateLocal ( );
                    for ( var currChildIdx = 0; currChildIdx < this.children.length; currChildIdx++ )
                        this.children[ currChildIdx ].updateAll ( );       
                };
            }
        }
    }
}