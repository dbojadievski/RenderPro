namespace renderPro {
    export namespace graphics {
        export namespace rendering {
            export class RenderingStatistics {
                element: HTMLElement
                programSwitches: number
                textureSwitches : number
                drawCalls: number
                timestamp: number
                durationLastFrame: number
                fps: number
                rendererName: string
                constructor ( )
                {
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;
                    this.timestamp          = Date.now ( );
                }
                updateFrame ()
                {
                    let now                 = Date.now ( );

                    this.durationLastFrame  = this.timestamp > 0 ? now - this.timestamp : -1;
                    this.fps                = 1000 / this.durationLastFrame
                    this.timestamp          = now;
                    
                    this.element.innerHTML         = this.durationLastFrame + " ms, "
                                                        + this.fps + " fps, "
                                                        + this.programSwitches + " program switches, "
                                                        + this.textureSwitches + " texture switches, "
                                                        + this.drawCalls + " draw calls on "
                                                        + this.rendererName;
                    this.textureSwitches    = 0;
                    this.programSwitches    = 0;
                }                
            }
        }
    }
}