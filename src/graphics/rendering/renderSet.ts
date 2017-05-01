namespace renderPro
{
    export namespace graphics
    {
        export namespace rendering
        {
            export class RenderSet
            {
                transparent: Array<renderPro.graphics.rendering.RenderableInstance>;
                opaque: Array<renderPro.graphics.rendering.RenderableInstance>;
                constructor ( transparent: Array<renderPro.graphics.rendering.RenderableInstance>, opaque: Array<renderPro.graphics.rendering.RenderableInstance> )
                {
                    this.opaque               = opaque;
                    this.transparent          = transparent;
                }
            }
        }
    }
}