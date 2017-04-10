/** @author Dino Bojadjievski, Sourcery (@bojadjievski) */
namespace renderPro { 
    export namespace dataStructures {
        export class LinkedList {
            data : any
            prev : any
            next : any
            constructor ( data  : any )
            {
                this.data                       = data;
                this.prev                       = null;
                this.next                       = null;
            }    
            addChild ( node : any ) : void
            {
                let oldnext : any            = this.next;
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

