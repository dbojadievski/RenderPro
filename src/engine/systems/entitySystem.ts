namespace renderPro
{
    export namespace core
    {
        export namespace systems
        {
            export class EntitySystem implements renderPro.core.interfaces.ISystem
            {
                private m_eventSystem:  Application.Infrastructure.ProEventSystem
                private m_entities:     Dictionary<string, Entity>;
                
                constructor ( eventSystem: Application.Infrastructure.ProEventSystem ) 
                {
                    this.m_eventSystem  = eventSystem;
                    this.m_entities     = new Dictionary<string, Entity> ( );
                }
                
                init ( ) : void
                {
                    const self          = this;
                    this.m_eventSystem.on ( 'shouldCreateEntity', function ( tag ) {
                        self.createEntity ( tag );
                    });
                }

                update ( ) : void
                {
                }

                find ( tag: string ) : Entity
                {
                    Application.Debug.assert ( isValidReference ( tag ) && tag.length != 0 );

                    let entity: Entity      = null;
                    
                    if ( isValidReference ( tag ) )
                    {
                        const trimmedTag    = tag.trim ( );
                        entity              = this.m_entities.getByKey ( trimmedTag );
                    }

                    return entity;
                } 

                exists ( tag: string ) : boolean
                {
                    const doesExist     = this.m_entities.hasKey( tag );
                    return doesExist;
                }

                createEntity ( tag: string ) : Entity
                {
                    let entity: Entity  = null;
                    
                    const doesExist     = this.m_entities.hasKey( tag );
                    if ( !doesExist )
                        entity          = new renderPro.core.Entity ( tag );

                    return entity;
                }

                attach ( parent: Entity, child: Entity )
                {
                    Application.Debug.assert ( isValidReference ( child ) );
                    Application.Debug.assert ( isValidReference ( parent ) );

                    if ( isValidReference ( parent ) && isValidReference ( child ) )
                    {
                        const hasChild      = parent.hasChild ( child.m_tag );
                        if ( !hasChild )
                        {
                            parent.m_children.push ( child );
                            child.m_parent  = parent;
                        }
                    }
                }

                attachByTag ( parentTag: string, childTag: string )
                {
                    Application.Debug.assert ( isValidReference ( parent ) && parent.length != 0 );
                    Application.Debug.assert ( isValidReference ( childTag ) && childTag.length != 0 );

                    if ( isValidReference ( parentTag ) && isValidReference ( parentTag ) )
                    {
                        let trimmedChildTag     = childTag.trim ( );
                        let trimmedParentTag    = parentTag.trim ( );

                        if ( trimmedChildTag.length != 0 && trimmedParentTag.length != 0 )
                        {
                            const child         = this.find ( trimmedChildTag );
                            const parent        = this.find ( trimmedParentTag );

                            this.attach ( parent, child );
                        }
                    }
                }

                detach ( parent: Entity, child: Entity )
                {
                    Application.Debug.assert ( isValidReference ( child ) );
                    Application.Debug.assert ( isValidReference ( parent ) );

                    if ( isValidReference ( parent ) && isValidReference ( child ) )
                    {
                        const idx               = parent.m_children.indexOf ( child );
                        if ( idx != -1 )
                            parent.m_children.splice ( idx, 1 );
                    }
                }

                detachByTag ( parentTag: string, childTag: string )
                {
                    Application.Debug.assert ( isValidReference ( parent ) && parent.length != 0 );
                    Application.Debug.assert ( isValidReference ( childTag ) && childTag.length != 0 );

                    if ( isValidReference ( parentTag ) && isValidReference ( parentTag ) )
                    {
                        let trimmedChildTag     = childTag.trim ( );
                        let trimmedParentTag    = parentTag.trim ( );

                        if ( trimmedChildTag.length != 0 && trimmedParentTag.length != 0 )
                        {
                            const child         = this.find ( trimmedChildTag );
                            const parent        = this.find ( trimmedParentTag );

                            this.detach ( parent, child );
                        }
                    }
                }
            }
        }
    }
}