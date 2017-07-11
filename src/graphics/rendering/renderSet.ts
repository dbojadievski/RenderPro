namespace renderPro
{
    export namespace graphics
    {
        export namespace rendering
        {
            export type renderableInstanceList = Array<renderPro.graphics.rendering.RenderableInstance>
            export class RenderSet
            {
                transparent: renderableInstanceList;
                opaque: renderableInstanceList;
                constructor ( transparent: renderableInstanceList = [ ], opaque: renderableInstanceList = [ ] )
                {
                    this.opaque               = opaque;
                    this.transparent          = transparent;
                }
            }
        }
    }
}