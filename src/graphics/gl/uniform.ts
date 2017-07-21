namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Uniform {
                location : WebGLUniformLocation
                gl: WebGLRenderingContext
                name: string
                values: any[]
                private type: string
                private compare: Function
                private setOnGPU: Function
                static readonly typeMapping: any = 
                {
                    "int"       : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1I,
                    "float"     : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1F,
                    "vec2"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_2FV,
                    "vec3"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_3FV,
                    "vec4"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_4FV,
                    "mat2"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_2FV,
                    "mat3"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_3FV,
                    "mat4"      : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_4FV,
                    "sampler2D" : renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1I
                }

                constructor ( name: string, type: string, gl: WebGLRenderingContext = renderPro.graphics.gl.context)
                {
                    this.gl         = gl;
                    this.name       = name;
                    this.type       = type;
                }

                init ( effect : renderPro.graphics.gl.Effect = null ) 
                {
                    if ( effect != null )
                        this.updateLocation( effect );

                    if ( this.location != null ) {
                        var self    = this;
                        switch ( renderPro.graphics.gl.Uniform.typeMapping[ this.type ] ) 
                        {
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1F: 
                                this.compare    = this.compareSimpleValues;
                                this.setOnGPU   = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform1f( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform1fv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_2F: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform2f( self.location, args[0], args[1] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_2FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform2fv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_3F: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform3f( self.location, args[0], args[1], args[2] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_3FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform3fv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_4F: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform4f( self.location, args[0], args[1], args[2], args[3] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_4FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform4fv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_2FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniformMatrix2fv( self.location, false, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_3FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniformMatrix3fv( self.location, false, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_MATRIX_4FV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[]  ) 
                                {
                                    self.gl.uniformMatrix4fv( self.location, false, args[0]);
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1I: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform1i( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_1IV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform1iv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_2I: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform2i( self.location, args[0], args[1] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_2IV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform2iv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_3I: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform3i( self.location, args[0], args[1], args[2] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_3IV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform3iv( self.location, args[0] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_4I: 
                                this.compare = this.compareSimpleValues;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform4i( self.location, args[0], args[1], args[2], args[3] );
                                };
                                break;
                            case  renderPro.graphics.gl.enums.ShaderUpdateType.UNIFORM_4IV: 
                                this.compare = this.compareArrays;
                                this.setOnGPU = function setOnGPU ( ...args: any[] ) 
                                {
                                    self.gl.uniform4iv( self.location, args[0] );
                                };
                                break;
                        }
                    }

                }
                set (  ...args: any[]) {
                    this.values  = args;
                    this.setOnGPU.apply(this, args);
                }
                updateLocation ( effect : renderPro.graphics.gl.Effect ) : void {
                    this.location   = this.gl.getUniformLocation( effect.programPointer, this.name );
                }
                updateValue ( ...args: any[] ) : void {
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

                    if ( needUpdate ) 
                    {
                        this.values  = args;
                        this.set.apply(this, args);
                    }
                }

                /*NOTE(Dino): Used for comparing uniform values internally. */
                private compareSimpleValues ( val1, val2 ) : boolean 
                {
                    let retVal: boolean     = false;
                    retVal                  = ( val1 === val2 );

                    return retVal;
                }
                
                private compareArrays ( arr1, arr2 ) : boolean 
                {
                    let retVal: boolean     = false;
                    if ( arr1.length == arr2.length ) 
                    {
                        let areEqual        = true;
                        for ( let i = 0; i < arr1.length; i++ ) 
                        {
                            if ( arr1[i] != arr2[i]) 
                            {
                                areEqual    = false;
                                break;
                            }   
                        }
                        retVal              = areEqual;
                    }

                    return true;
                }
            }
        }
    }
}