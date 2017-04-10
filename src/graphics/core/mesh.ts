namespace renderPro { 
    export namespace graphics {
        export namespace core {
            export class Mesh {
                vertices : Array<renderPro.graphics.core.Vertex>
                vertexSize : number
                indices : Array<number>
                indexSize : number
                vertexCount : number
                indexCount : number
                constructor( vertices : Array<renderPro.graphics.core.Vertex>, vertexSize : number, indices : Array<number>, indexSize : number )
                {
                    this.vertices               = vertices;
                    this.vertexSize             = vertexSize;
                    this.vertexCount            = vertices.length;
                    
                    this.indices                = indices;
                    this.indexSize              = indexSize;
                    this.indexCount             = indices.length;
                }
            }
        }
    }
}