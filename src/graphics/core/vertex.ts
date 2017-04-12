namespace renderPro {
    export namespace graphics {
        export namespace core {
            export class Vertex {
                position : Float32Array
                uv : Float32Array
                normal : Float32Array
                constructor ( position : Float32Array, uv : Float32Array, normal: Float32Array) 
                {
                    this.position           = position;
                    this.uv                 = uv;
                    this.normal             = normal;
                }
                getSize ( ) : number
                {
                    let size : number               = 0;
                    
                    if ( this.position !== undefined )
                        size                += this.position.length;
                    
                    if ( this.uv !== undefined )
                        size                += this.uv.length;

                    if ( this.normal !== undefined )
                        size                += this.normal.length;

                    return size;
                }
                getBuffer ( ) : Array<any> 
                {
                    let buffer : Array<any>             = [ ];

                    if ( this.position !== undefined )
                        buffer              = buffer.concat ( this.position );
                    
                    return buffer;
                }
            }
        }
    }
}



