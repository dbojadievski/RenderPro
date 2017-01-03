( function ( ) 
{
    function Scene ( )
    {
        this.nodes          = new renderPro.data.scene.SceneNode ( null );
        this.lights         = [ ];
        this.cameras        = [ ];
    }

    Scene.prototype.addNode = function scene_addNode ( sceneNode )
    {
        Application.Debug.assert ( sceneNode instanceof renderPro.data.scene.SceneNode, "Invalid param: arg 'sceneNode' not an instanc of SceneNode." );
        this.nodes.addChild ( sceneNode );
    };

    Scene.prototype.addLight = function scene_addLight ( light )
    {
        Application.Debug.assert ( light instanceof renderPro.graphics.scene.lighting.SpotLight || light instanceof renderPro.graphics.scene.lighting.DirectionalLight || renderPro.graphics.scene.lighting.PointLight, "Invalid argument: arg 'light' not an instance of any light classes." );
        this.lights.push ( light );
    }

    Scene.prototype.addCamera = function scene_addCamera ( camera )
    {
        Application.Debug.assert ( camera instanceof renderPro.graphics.scene.Camera, "Invalid argument: arg 'camera' not an instance of 'Camera'." );
    };
}) ( );