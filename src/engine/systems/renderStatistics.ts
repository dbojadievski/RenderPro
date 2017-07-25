namespace renderPro 
{
    export namespace core 
    {
        export namespace systems
        {
            export class RenderStatistics implements renderPro.core.interfaces.ISystem
            {
                private element : HTMLElement
                rendererName:     string
                
                timeLastFrame: number
                
                drawCalls: number
                textureSwitches: number
                programSwitches: number

                durationLastFrame : number
                fps: number

                constructor ( element: HTMLElement) 
                {
                    this.rendererName       = "";
                    this.element            = element;
                    this.drawCalls          = 0;
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;

                }
                init () {
                    this.timeLastFrame      = Date.now ( );
                }
                update () {
                    const currentTime       = Date.now ( );
                    this.durationLastFrame  = currentTime - this.timeLastFrame;
                    this.fps                = 1000 / this.durationLastFrame;
                    
                    this.setHtml();

                    this.drawCalls          = 0;
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;

                    this.timeLastFrame      = currentTime;
                }
                private setHtml ( ) {
                    Application.Debug.assert( this.element != undefined );
                    this.element.innerHTML = "" +
                        this.durationLastFrame + " ms, " +
                        Math.floor(this.fps) + " fps, " + 
                        this.drawCalls + " drawCalls, " +
                        this.textureSwitches + " texture switches, " +
                        this.programSwitches + " program switches " +
                        " on " + this.rendererName

                }
            }
        }
    }
}