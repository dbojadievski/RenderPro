namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export enum UniformType {
                UNIFORM_1F, UNIFORM_1FV,
                UNIFORM_2F, UNIFORM_2FV,
                UNIFORM_3F, UNIFORM_3FV,
                UNIFORM_4F, UNIFORM_4FV,
                UNIFORM_MATRIX_2FV,
                UNIFORM_MATRIX_3FV,
                UNIFORM_MATRIX_4FV,
                UNIFORM_1I, UNIFORM_1IV,
                UNIFORM_2I, UNIFORM_2IV,
                UNIFORM_3I, UNIFORM_3IV,
                UNIFORM_4I, UNIFORM_4IV
            }
            export class Uniform {
                location : WebGLUniformLocation
                gl: WebGLRenderingContext
                name: String
                values: any[]
                private type : UniformType
                private compare : Function
                private set : Function
                constructor ( gl: WebGLRenderingContext, program: WebGLProgram, name: string, type: UniformType ) {
                    this.location   = gl.getUniformLocation(program, name);
                    this.gl         = gl;
                    this.name       = name;

                    var self = this;
                    switch (type) {
                        case UniformType.UNIFORM_1F: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform1f( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_1FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform1fv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_2F: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform2f( self.location, args[0], args[1] );
                            };
                            break;
                        case UniformType.UNIFORM_2FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform2fv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_3F: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform3f( self.location, args[0], args[1], args[2] );
                            };
                            break;
                        case UniformType.UNIFORM_3FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform3fv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_4F: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform4f( self.location, args[0], args[1], args[2], args[3] );
                            };
                            break;
                        case UniformType.UNIFORM_4FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform4fv( self.location, args[0] );
                            };
                            break;
                         case UniformType.UNIFORM_MATRIX_2FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniformMatrix2fv( self.location, false, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_MATRIX_3FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniformMatrix3fv( self.location, false, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_MATRIX_4FV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[]  ) 
                            {
                                self.gl.uniformMatrix4fv( self.location, false, args[0]);
                            };
                            break;
                        case UniformType.UNIFORM_1I: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform1i( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_1IV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform1iv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_2I: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform2i( self.location, args[0], args[1] );
                            };
                            break;
                        case UniformType.UNIFORM_2IV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform2iv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_3I: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform3i( self.location, args[0], args[1], args[2] );
                            };
                            break;
                        case UniformType.UNIFORM_3IV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform3iv( self.location, args[0] );
                            };
                            break;
                        case UniformType.UNIFORM_4I: 
                            this.compare = this.compareSimpleValues;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform4i( self.location, args[0], args[1], args[2], args[3] );
                            };
                            break;
                        case UniformType.UNIFORM_4IV: 
                            this.compare = this.compareArrays;
                            this.set = function set ( ...args: any[] ) 
                            {
                                self.gl.uniform4iv( self.location, args[0] );
                            };
                            break;
                    }
                }
                update ( ...args: any[] ) : void {
                    let needUpdate = false;

                    // Check if new values are of a different length
                    if( this.values === undefined || this.values.length != args.length ) {
                        needUpdate = true;
                    } else {
                        // Check if every pair of values is different
                        for ( let i = 0; i < args.length; i++ ) {
                            if ( !this.compare(args[i], this.values[i]) ) {
                                needUpdate = true;
                                break;
                            }   
                        }
                    }

                    if ( needUpdate ) {
                        this.values  = args;
                        this.set.apply(self, args);
                    }
                }
                private compareSimpleValues ( val1, val2 ) : boolean {
                    return val1 === val2;
                }
                private compareArrays ( arr1, arr2 ) : boolean {
                    if( arr1.length != arr2.length ) {
                        return false;
                    }
                    for ( let i = 0; i < arr1.length; i++ ) {
                        if ( arr1[i] != arr2[i]) {
                            return false;
                        }   
                    }
                    return true;
                }
            }
        }
    }
}