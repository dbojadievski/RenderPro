namespace renderPro {
    export namespace graphics {
        export namespace rendering {
            export class RenderableInstance {
                renderable : renderPro.graphics.gl.Renderable // TODO: change to renderable
                sceneNode : renderPro.data.scene.SceneNode // TODO: change to scenenode
                constructor ( renderable : renderPro.graphics.gl.Renderable, sceneNode : renderPro.data.scene.SceneNode )
                {
                    this.renderable             = renderable;
                    this.sceneNode              = sceneNode;
                }
            }
        }
    }
}