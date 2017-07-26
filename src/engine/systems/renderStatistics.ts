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
                    this.resetValues ();
                }
                update () {
                    this.setHtml();
                }
                setValues () {
                    const currentTime       = Date.now ( );
                    this.durationLastFrame  = currentTime - this.timeLastFrame;

                }
                resetValues () {
                    this.timeLastFrame     = Date.now();
                    this.drawCalls          = 0;
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;
                }
                private setHtml ( ) {
                    Application.Debug.assert( this.element != undefined );
                    this.fps                = Math.round(1000 / ( Date.now() - this.timeLastFrame ) );
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