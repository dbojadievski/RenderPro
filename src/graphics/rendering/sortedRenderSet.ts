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
                    Application.Debug.assert ( isValidReference ( opaque ) );
                    Application.Debug.assert ( isValidReference ( transparent ) );
                    
                    this.opaque               = opaque;
                    this.transparent          = transparent;
                }
            }
        }
    }
}