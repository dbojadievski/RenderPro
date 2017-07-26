namespace renderPro
{
    export namespace core 
    {
        export interface IEntityComponent
        {
            init ( ) : void
            update ( ) : void
        }

        export class Entity
        {
            m_tag:         string
            m_parent:       Entity
            m_children:     Array<Entity>
            m_components:   Dictionary<string, IEntityComponent>
            
            private m_id :  number
            private static s_id     = 0;

            constructor ( tag: string, parent: Entity = null )
            {
                Application.Debug.assert ( isValidReference ( tag ) && tag.length != 0 );
                
                this.m_tag          = tag.trim ( );
                this.m_parent       = parent;
                
                this.m_children     = new Array<Entity> ( );
                this.m_components   = new Dictionary<string, IEntityComponent> ( );

                this.m_id           = ++Entity.s_id;
            }

            hasChild ( tag: string ) : boolean
            {
                Application.Debug.assert ( isValidReference ( tag ) && tag.length > 0 );
                
                let hasChild            = false;
                if ( isValidReference ( tag ) )
                {
                    const trimmedTag    = tag.trim ( );
                    for ( let i         = 0; i < this.m_children.length; i++ )
                    {
                        const child     = this.m_children[ i ];
                        if ( child.m_tag == trimmedTag )
                        {
                            hasChild    = true;
                            break;
                        }
                    }
                }

                return hasChild;
            }
        }
    }
}