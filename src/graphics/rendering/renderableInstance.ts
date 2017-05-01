namespace renderPro {
    export namespace graphics {
        export namespace rendering {
            export class RenderableInstance {
                renderable : renderPro.graphics.gl.Renderable
                sceneNode : renderPro.data.scene.SceneNode
                constructor ( renderable : renderPro.graphics.gl.Renderable, sceneNode : renderPro.data.scene.SceneNode )
                {
                    this.renderable             = renderable;
                    this.sceneNode              = sceneNode;
                }
            }
        }
    }
}