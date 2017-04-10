namespace renderPro {
    export namespace data {
        export namespace scene {
            export class Scene {
                nodes:  renderPro.data.scene.SceneNode;
                lights: any 
                cameras: Array<renderPro.graphics.scene.Camera>
                constructor ( )
                {
                    this.nodes              = new renderPro.data.scene.SceneNode ( null );
                    this.lights             = 
                    {
                        pointLights:        [ ],
                        spotLights:         [ ],
                        directionalLights:  [ ]
                    };
                    this.cameras            = [ ];
                }
                addNode ( sceneNode : renderPro.data.scene.SceneNode ) : void
                {
                    Application.Debug.assert ( sceneNode instanceof renderPro.data.scene.SceneNode, "Invalid param: arg 'sceneNode' not an instanc of SceneNode." );
                    this.nodes.addChild ( sceneNode );
                }
                addLight ( light : renderPro.graphics.scene.lighting.SpotLight | renderPro.graphics.scene.lighting.SpotLight |  renderPro.graphics.scene.lighting.PointLight ) : void 
                {
                    Application.Debug.assert ( light instanceof renderPro.graphics.scene.lighting.SpotLight || light instanceof renderPro.graphics.scene.lighting.DirectionalLight || light instanceof renderPro.graphics.scene.lighting.PointLight, "Invalid argument: arg 'light' not an instance of any light classes." );
                    if ( light instanceof renderPro.graphics.scene.lighting.SpotLight )
                        this.lights.spotLights.push ( light );
                    else if ( light instanceof renderPro.graphics.scene.lighting.DirectionalLight )
                        this.lights.directionalLights.push ( light );
                    else if ( light instanceof renderPro.graphics.scene.lighting.PointLight )
                        this.lights.pointLights.push ( light );
                }
                addCamera ( camera : renderPro.graphics.scene.Camera ) : void
                {
                    Application.Debug.assert ( camera instanceof renderPro.graphics.scene.Camera, "Invalid argument: arg 'camera' not an instance of 'Camera'." );
                }
            }
        }
    }
}