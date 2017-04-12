/** @author Dino Bojadjievski, Sourcery (@bojadjievski) */
namespace renderPro { 
    export namespace dataStructures {
        export class LinkedList<T> {
            data : T
            prev : LinkedList<T>
            next : LinkedList<T>
            constructor ( data  : T )
            {
                this.data                       = data;
                this.prev                       = null;
                this.next                       = null;
            }    
            addChild ( node : LinkedList<T> ) : void
            {
                let oldnext : LinkedList<T>            = this.next;
                this.next                    = node;
                this.next.next               = oldnext;
                this.next.prev               = this;
                if ( oldnext !== null )
                    oldnext.prev             = this.next;
            }
            removeChild ( ) : void
            {
                if ( this.next !== null )
                {
                    let removed                 = this.next;
                    this.next                   = this.next.next;
                    if ( this.next != null )
                        this.next.prev          = this;

                }
            }
        }
        
    }
}

