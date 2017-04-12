namespace renderPro {
    export namespace graphics {
        export namespace scene {
            export namespace lighting {
                export class DirectionalLight {
                    direction : Float32Array

                    ambient : Array<number>
                    diffuse : Array<number>
                    specular : Array<number>
                    constructor ( direction : Float32Array, ambient : Array<number>, diffuse : Array<number>, specular : Array<number> )
                    {
                        this.direction                  = direction;
                        
                        this.ambient                    = ambient;
                        this.diffuse                    = diffuse;
                        this.specular                   = specular;    
                    }
                }
                export class PointLight {
                    position : Float32Array
                    ambient : Array<number>
                    diffuse : Array<number>
                    specular : Array<number>
                    constructor ( position : Float32Array, ambient : Array<number>, diffuse : Array<number>, specular : Array<number>)
                    {
                        this.position                   = position;
                        this.ambient                    = ambient;
                        this.diffuse                    = diffuse;
                        this.specular                   = specular;
                    }
                }
                export class SpotLight {
                    position : Float32Array

                    ambient : Array<number>
                    diffuse : Array<number>
                    specular : Array<number>

                    attenuation : any
                    computeDistanceAttenuation : any
                    
                    spotDirection : Array<number>
                    spotExponent : any
                    spotCutoffAngle : any
                    constructor  ( 
                        position : Float32Array, 
                        ambient : Array<number>, diffuse : Array<number>, specular: Array<number>, 
                        spotDirection: Array<number>, spotExponent : any, spotCutoffAngle : any,
                        attenuation: any, computeDistanceAttenuation : any ) 
                    {
                        this.position                   = position;
                        
                        this.ambient                    = ambient;
                        this.diffuse                    = diffuse;
                        this.specular                   = specular;

                        this.attenuation                = attenuation;
                        this.computeDistanceAttenuation = computeDistanceAttenuation;
                        
                        
                        this.spotDirection              = spotDirection;
                        this.spotExponent               = spotExponent;
                        this.spotCutoffAngle            = spotCutoffAngle;
                    }
                }
            }

        }
    }
}
