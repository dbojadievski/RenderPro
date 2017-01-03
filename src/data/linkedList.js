/** @author Dino Bojadjievski, Sourcery (@bojadjievski) */
( function ( ) 
{
    function LinkedList ( data )
    {
        this.data                       = data;
        this.prev                       = null;
        this.next                       = null;
    }

    LinkedList.prototype.addChild = function linkedList_addChild ( child )
    {
        var grandchild                  = this.child;
        this.child                      = child;
        this.child.child                = grandchild;
        this.child.prev                 = this;
        if ( grandchild !== null )
            grandchild.prev             = this.child;
    };

    LinkedList.prototype.removeChild    = function linkedList_removeChild ( )
    {
        if ( this.next !== null )
        {
            var removed                 = this.next;
            this.next                   = this.next.next;
            if ( this.next != null )
                this.next.prev          = this;

        }
    };

    renderPro.dataStructures.LinkedList = LinkedList;
} ) ( );
