namespace Application
{
    export namespace Infrastructure
    {
        export class ProEventSystem implements renderPro.core.interfaces.ISystem
        {
            _events: Array<any>;

            constructor ( )
            {
                this._events                        = new Array<any> ( );
            }

            on ( event: string, handler: Function )
            {
                if ( !this._events[ event ] )
                    this._events[ event ]           = new Array<Function> ( );

                this._events[ event ].push ( handler );
            }

            fire ( event: string, args:any = undefined ) : void
            {
                let handlers:Array<any>             = this._events[ event ];
                if ( handlers )
                {
                    for ( let handler in handlers )
                    {
                        let h                       = handlers[ handler ];
                        h ( args );
                    }
                }
            }

            fireOA ( event: string, args ) : void
            /* NOTE(Dino): Fires with an object argument. */
            {
                let handlers: Array<any>            = this._events[ event ];
                if ( handlers )
                {
                    for ( let handler in handlers )
                    {
                        let h                       = handlers[ handler ];
                        h ( args );
                    }
                }
            }

            fireVA ( event: string, ...args: Array<any> ) : void
            {
                let handlers:Array<any>             = this._events[ event ];
                if ( handlers )
                {
                    for ( let handler in handlers )
                        handlers[ handler ] ( args );
                }
            }

            disconnect ( event:string, handler: Function ) : void
            {
                let handlers:Array<Function>        = this._events[event];

                if ( handlers )
                {
                    let index:number                = handlers.indexOf( handler );
                    if ( index >= 0 )
                        handlers.splice( index, 1 );
                }
            }

            init ( ) : void { }
            update ( ) : void { }
        }
    }
}