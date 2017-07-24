namespace renderPro {
    export namespace core {
        export class Engine implements renderPro.core.interfaces.ISystem {
            assetManager: renderPro.core.systems.AssetManager
            renderer: renderPro.core.systems.renderers.WebGLRenderer
            systems: Array<renderPro.core.interfaces.ISystem>
            assets: any
            constructor (assets: any) {
                this.assets = assets;
            }
            init () {
                let self            = this;               
                Application.Systems.eventSystem = new Application.Infrastructure.ProEventSystem();
                this.assetManager   = new renderPro.core.systems.AssetManager(this.assets);
                this.renderer       = new renderPro.core.systems.renderers.WebGLRenderer(this.assetManager, Application.Systems.eventSystem);

                this.systems        = [ Application.Systems.eventSystem, this.assetManager ];

                for ( let systemIdx : number = 0; systemIdx < this.systems.length; systemIdx++ ) {
                    this.systems[systemIdx].init()
                }

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
                let self = this;
                Application.Systems.eventSystem.on("resourcesLoaded", function ( ) 
                { 
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