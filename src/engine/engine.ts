namespace renderPro {
    export namespace core {
        export class Engine implements renderPro.core.interfaces.ISystem {
            assetManager: renderPro.core.systems.AssetManager
            systems: Array<renderPro.core.interfaces.ISystem>
            entitySystem: renderPro.core.systems.EntitySystem
            renderStats: renderPro.core.systems.RenderStatistics
            renderer: renderPro.core.systems.renderers.WebGLRenderer
            assets: any
            constructor (assets: any) {
                this.assets = assets;
            }
            
            init () {
                let self            = this;
                
                // let canvas : HTMLCanvasElement  = document.getElementById ( "canvas" ) as HTMLCanvasElement;
                let statsElement                = document.getElementById ( 'lblPerformance' );

                let canvas : HTMLCanvasElement  = document.getElementById ( "canvas" ) as HTMLCanvasElement;
                let glContext                   = canvas.getContext( "experimental-webgl" );
                let viewportWidth               = canvas.width;
                let viewportHeight              = canvas.height;

                this.renderStats    = new renderPro.core.systems.RenderStatistics ( statsElement, Application.Systems.eventSystem );
                this.assetManager   = new renderPro.core.systems.AssetManager ( this.assets, this.renderStats );
                this.renderer       = new renderPro.core.systems.renderers.WebGLRenderer ( glContext, viewportWidth, viewportHeight, this.assetManager, Application.Systems.eventSystem );
                this.entitySystem   = new renderPro.core.systems.EntitySystem ( Application.Systems.eventSystem );
                this.systems        = [ Application.Systems.eventSystem, this.assetManager, this.renderStats, this.entitySystem ];

                for ( let systemIdx : number = 0; systemIdx < this.systems.length; systemIdx++ ) {
                    this.systems[systemIdx].init()
                }

                // Note(Martin): The renderer has to wait for all the resources to be loaded before initializing
                Application.Systems.eventSystem.on("resourcesLoaded", function ( ) 
                { 
                    self.renderer.init();
                    self.systems.push(self.renderer);
                } );
            }
            update () {
                for ( let systemIdx : number = 0; systemIdx < this.systems.length; systemIdx++ ) {
                    this.systems[systemIdx].update()
                }
            }
            start () {
                let self            = this;
                Application.Systems.eventSystem.on("resourcesLoaded", function ( ) 
                {
                    Application.Systems.console.parseCommand ( 'addIntegers 2 3', true ); 
                    self.update();
                    (function animloop( )
                    {
                        requestAnimationFrame ( animloop );
                        self.update ( );
                    })();
                } );
            }
        }
    }
}