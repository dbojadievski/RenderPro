namespace renderPro
{
    export namespace core
    {
        export namespace interfaces
        {
            export interface ISystem
            {
                init ( ) : void; /* Handles complex one-time set-up, should such a set-up be needed. */
                update ( ) : void; /* Handles per-tick processing, if any is to be done. */
            }
        }
    }
}