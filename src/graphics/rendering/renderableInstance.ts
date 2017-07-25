namespace renderPro {
    export namespace graphics {
        export namespace rendering {
            export class RenderableInstance {
                renderable : renderPro.graphics.gl.IRenderable
                sceneNode : renderPro.data.scene.SceneNode
                constructor ( renderable : renderPro.graphics.gl.IRenderable, sceneNode : renderPro.data.scene.SceneNode )
                {
                    Application.Debug.assert ( isValidReference ( sceneNode ) );
                    Application.Debug.assert ( isValidReference ( renderable ) );

                    this.renderable             = renderable;
                    this.sceneNode              = sceneNode;
                }
            }
        }
    }
}