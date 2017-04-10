/**
 * @author Dino Bojadjievski, Sourcery (@bojadjievski).
 */

namespace renderPro {
    export namespace math {
        export class MatrixStack {
            currentState: any
            matrices: renderPro.dataStructures.LinkedList
            constructor ( ) 
            {
                this.currentState           = mat4.create ( );
                mat4.identity ( this.currentState );
                this.matrices               = null;
            }
            push ( matrix )
            {
                let node : renderPro.dataStructures.LinkedList  = new renderPro.dataStructures.LinkedList ( matrix );
                node.prev                   = this.matrices;
                if ( this.matrices !==  null)
                    this.matrices.next      = node;
                this.matrices               = node;

                mat4.multiply ( this.currentState, matrix );
            }
            pop ( ) 
            {
                var popped                  = this.matrices;
                var inverse                 = mat4.inverse ( popped.data );
                if ( inverse !== null )
                /* Note(Dino): Remember that not all matrices are invertible! Reference Целаковски, Наум: Виша Математика 4 for more information.  */ 
                {
                    mat4.multiply ( this.currentState, inverse );
                    this.matrices           = this.matrices.prev;
                    if ( this.matrices !== null )
                        this.matrices.next  = null;
                    
                    /* We need to mark up the removed transformation and its containing node for garbage collection. */
                    popped.data             = null;
                    popped.prev             = null;
                    popped.next             = null;
                }
            };
        }
    }
}

/* Here follow the unit tests for this type. */
( function ( ) 
{

    ( function matrixStack_push_test ( )
    {
        var matrixStack             = new renderPro.math.MatrixStack ( );
        
        var translationX            = mat4.create ( );
        mat4.identity ( translationX );
        mat4.translate ( translationX, [ 3, 0, 0 ] );
        matrixStack.push ( translationX );
        
        
        var translationY            = mat4.create ( );
        mat4.identity ( translationY );
        mat4.translate ( translationY, [ 0, 5, 0 ] );
        matrixStack.push ( translationY );

        var translationZ            = mat4.create ( );
        mat4.identity ( translationZ );
        mat4.translate ( translationZ, [ 0, 0, 7 ] );
        matrixStack.push ( translationZ );
        
        Application.Debug.assert ( matrixStack.currentState[ 12 ] === 3, "Matrix stack current state not valid." );
        Application.Debug.assert ( matrixStack.currentState[ 13 ] === 5, "matrix stack current state not valid." );
        Application.Debug.assert ( matrixStack.currentState[ 14 ] === 7, "Matrix stack current state not valid." );

        Application.Debug.assert ( matrixStack.matrices.data[ 14 ] === 7, "Matrix stack top Z-translation value not as expected." );
        Application.Debug.assert ( matrixStack.matrices.prev != null && matrixStack.matrices.prev.data[ 13 ] === 5, "Matrix stack second-to-top Y-translation value not as expected." );
        Application.Debug.assert ( matrixStack.matrices.prev.prev != null && matrixStack.matrices.prev.prev.data[ 12 ] === 3, "Matrix stack third-to-top X-translation value not as expected." );
        Application.Debug.assert ( matrixStack.matrices.prev.prev.prev === null, "No more matrices should exist." );
        Application.Debug.assert ( matrixStack.matrices.next === null, "Matrix stack not empty." );
    } ) ( );

    ( function matrixStack_pop_test ( ) 
    {
        var matrixStack             = new renderPro.math.MatrixStack ( );

        var translationX            = mat4.create ( );
        mat4.identity ( translationX );
        mat4.translate ( translationX, [ 3.0, 0.0, 0.0 ] );
        matrixStack.push ( translationX );
        Application.Debug.assert ( matrixStack.matrices.data == translationX, "Stack not created properly." );

        var translationY            = mat4.create ( );
        mat4.identity ( translationY );
        mat4.translate ( translationY, [ 0.0, 5.0, 0.0 ] );
        matrixStack.push ( translationY );
        Application.Debug.assert ( matrixStack.matrices.data == translationY, "Stack not created properly." );

        var translationZ = mat4.create ( );
        mat4.identity ( translationZ );
        mat4.translate ( translationZ, [ 0.0, 0.0, 7.0 ] );
        matrixStack.push ( translationZ );
        Application.Debug.assert ( matrixStack.matrices.data == translationZ, "Stack not created properly." );
        
        matrixStack.pop ( );
        Application.Debug.assert ( matrixStack.matrices.data == translationY && matrixStack.matrices.next === null && matrixStack.matrices.prev != null, "Previous transform not reversed properly." );
        
        matrixStack.pop ( );
        Application.Debug.assert ( matrixStack.matrices.data == translationX && matrixStack.matrices.next === null && matrixStack.matrices.prev == null, "Previous transform not reversed properly." );
        
        matrixStack.pop ( );
        Application.Debug.assert ( matrixStack.matrices === null && matrixStack.currentState !== null, "" );
    } ) ( );

} ) ( );