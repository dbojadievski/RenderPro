namespace renderPro { 
    export namespace graphics {
        export namespace core {
            export class Material {
                ambient : Array<number>
                diffuse : Array<number>
                specular : Array<number>
                shininess : number
                constructor( ambient : Array<number>, diffuse : Array<number>, specular : Array<number>, shininess : number ) {
                    this.ambient                    = ambient;
                    this.diffuse                    = diffuse;
                    this.specular                   = specular;
                    this.shininess                  = shininess;
                }
            }
        }
    }
} 