namespace renderPro { 
    export namespace graphics {
        export namespace core {
            export class Material {
                materialID: number
                name: string
                ambient : Array<number>
                diffuse : Array<number>
                specular : Array<number>
                shininess : number
                textures: Dictionary<string, any>
                constructor( ambient : Array<number>, diffuse : Array<number>, specular : Array<number>, shininess : number ) {
                    this.ambient                    = ambient;
                    this.diffuse                    = diffuse;
                    this.specular                   = specular;
                    this.shininess                  = shininess;
                    this.textures                   = new Dictionary<string, any>()
                }
            }
        }
    }
} 