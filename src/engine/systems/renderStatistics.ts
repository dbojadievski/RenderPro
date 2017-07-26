namespace renderPro 
{
    export namespace core 
    {
        export namespace systems
        {
            export class RenderStatistics implements renderPro.core.interfaces.ISystem
            {
                private m_domNode:      HTMLElement // Used for the visual presentation of statistics in debug.
                private m_eventSystem:  Application.Infrastructure.ProEventSystem
                private m_repository:   Dictionary<String, any>      
                
                rendererName:     string
                
                timeLastFrame: number
                
                drawCalls: number
                textureSwitches: number
                programSwitches: number

                durationLastFrame : number

                constructor ( element: HTMLElement, eventSystem: Application.Infrastructure.ProEventSystem ) 
                {
                    this.rendererName       = "";
                    this.m_domNode          = element;
                    this.drawCalls          = 0;
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;

                    this.m_eventSystem      = eventSystem;
                    this.m_repository       = new Dictionary<String, any> ( );
                }

                init () 
                {
                    const self              = this;
                    this.m_eventSystem.on ( 'frameRendered', function ( stat ) 
                    {
                        RenderStatistics.handleFrameRendered ( stat, self );
                    });
                }

                update () 
                {
                    this.setHtml();
                }
                
                setValues () 
                {
                    const currentTime       = Date.now ( );
                    this.durationLastFrame  = ( currentTime - this.timeLastFrame );
                }

                private setHtml ( ) 
                {
                    Application.Debug.assert( this.m_domNode != undefined );

                    const msPart = ( this.timeLastFrame == 0 ? "Less than 1 ms " : ( this.timeLastFrame + " ms " ) ); 
                    this.m_domNode.innerHTML = "" +
                        msPart + 
                        this.drawCalls + " drawCalls, " +
                        this.textureSwitches + " texture switches, " +
                        this.programSwitches + " program switches " +
                        " on " + this.rendererName
                }

                private static handleFrameRendered ( stat: renderPro.data.dto.RenderStatisticsDTO, caller: RenderStatistics )
                {
                    Application.Debug.assert ( isValidReference ( stat ) );
                    
                    const frameTime           = new KeyValuePair<String, number> ( "frameTime", stat.m_frameTime );
                    caller.m_repository.set ( frameTime );
                    
                    const drawCalls           = new KeyValuePair<String, number> ( "numDrawCalls", stat.m_numDrawCalls );
                    caller.m_repository.set ( drawCalls );

                    const progSwitches        = new KeyValuePair<String, number> ( "numProgramSwitches", stat.m_numProgramSwitches );
                    caller.m_repository.set ( progSwitches );

                    const textSwitches        = new KeyValuePair<String, number> ( "numTextureSwitches", stat.m_numTextureSwitches );
                    caller.m_repository.set ( textSwitches );

                    const renderer            = new KeyValuePair<String, string> ( "rendererName", stat.m_rendererName );
                    caller.m_repository.set ( renderer );
                    
                    caller.timeLastFrame      = caller.durationLastFrame;
                    caller.durationLastFrame  = stat.m_frameTime;
                    caller.drawCalls          = stat.m_numDrawCalls;
                    caller.programSwitches    = stat.m_numProgramSwitches;
                    caller.textureSwitches    = stat.m_numTextureSwitches;
                    
                    caller.rendererName       = renderer.value;
                }
            }
        }
    }
}