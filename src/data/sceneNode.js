( function ( ) 
{
    function SceneNode ( parent )
    {
        this.parent                 = parent;
        this.children               = [ ];

        this.preXYZ                 = vec3.fromValues ( 0.0, 0.0, 0.0 );
        this.prePYR                 = vec3.fromValues ( 0.0, 0.0, 0.0 );
        this.transform              = mat4.create ( );
        mat4.identity ( this.transform );

        if ( parent instanceof SceneNode )
            parent.addChild ( this );
    }
    
    SceneNode.prototype.addChild    = function sceneNode_addChild ( child )
    {
        this.children.push ( child );
        this.child.parent           = this;
    };

    /*
     * Updates only this node's transformation matrix, based on the pre-transform values.
     * It resets the pre-transform values to the defaults afterwards.
     * Note(Dino):
     * The defaults are nil vectors.
     */
    SceneNode.prototype.updateLocal = function sceneNode_updateLocal ( )
    {
        this.transform.rotateX ( this.transform, this.prePYR[ 2 ] );
        this.transform.rotateY ( this.transform, this.prePYR[ 1 ] );
        this.transform.rotateZ ( this.transform, this.prePYR[ 0 ] );
        this.transform.translate ( this.transform, this.preXYZ );
    };

    /*
        Updates this node's and all descendant nodes' transformation matrices.
        It resets the pre-transform values to the defaults afterwards.
     */
    SceneNode.prototype.updateAll = function sceneNode_updateAll ( )
    {
        this.updateLocal ( );
        for ( var currChildIdx = 0; currChildIdx < this.children.length; this.currChildIdx++ )
            this.children[ currChildIdx ].updateAll ( );       
    };

    renderPro.data.scene.SceneNode  = SceneNode;
} ) ( );