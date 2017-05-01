namespace renderPro
{
    export namespace graphics
    {
        export namespace rendering
        {
            export class RenderSet
            {
                renderables: Array<renderPro.graphics.gl.Renderable>;
                instances: Array<renderPro.graphics.rendering.RenderableInstance>;

                constructor ( renderables: Array<renderPro.graphics.gl.Renderable>, instances: Array<renderPro.graphics.rendering.RenderableInstance> )
                {
                    this.instances          = instances;
                    this.renderables        = renderables;
                }
            }
        }
    }
}