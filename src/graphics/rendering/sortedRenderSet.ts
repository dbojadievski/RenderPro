namespace renderPro
{
    export namespace graphics
    {
        export namespace rendering
        {
            export type RenderInstanceDictionary = Dictionary<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>>;
            export class SortedRenderSet
            {
                transparent: RenderInstanceDictionary
                opaque:  RenderInstanceDictionary
                constructor ( transparent:  RenderInstanceDictionary = new Dictionary<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>>(), opaque:  RenderInstanceDictionary = new Dictionary<renderPro.graphics.core.Effect, Dictionary<renderPro.graphics.core.Texture, Array<renderPro.graphics.rendering.RenderableInstance>>>() )
                {
                    this.opaque               = opaque;
                    this.transparent          = transparent;
                }
            }
        }
    }
}