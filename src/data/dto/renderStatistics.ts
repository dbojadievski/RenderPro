namespace renderPro
{
    export namespace data
    {
        export namespace dto
        {
            export class RenderStatisticsDTO
            {
                m_frameTime:              number
                m_numDrawCalls:           number
                m_numTextureSwitches:     number
                m_numProgramSwitches:     number
                m_rendererName:           string
                
                constructor ( frameTime: number = 0, numDrawCalls: number = 0, numTextureSwitches: number = 0, numProgramSwitches: number = 0, rendererName: string )
                {
                    Application.Debug.assert ( frameTime >= 0 );
                    Application.Debug.assert ( numDrawCalls >= 0 );
                    Application.Debug.assert ( numTextureSwitches >= 0 );
                    Application.Debug.assert ( numProgramSwitches >= 0 );

                    this.m_frameTime            = frameTime;
                    this.m_numDrawCalls         = numDrawCalls;
                    this.m_numProgramSwitches   = numProgramSwitches;
                    this.m_numTextureSwitches   = numTextureSwitches;

                    this.m_rendererName         = rendererName;
                }

                clear ( ) : void
                {
                    this.m_frameTime            = 0;
                    this.m_numDrawCalls         = 0;
                    this.m_numProgramSwitches   = 0;
                    this.m_numTextureSwitches   = 0;
                    
                    this.m_rendererName = "";
                }
            }
        }
    }
}