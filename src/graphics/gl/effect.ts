var versionNumber = "0.1a";
namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Effect {
                uniforms: any
                attributes: any
                vertexShader: renderPro.graphics.gl.Shader
                fragmentShader: renderPro.graphics.gl.Shader
                programPointer: WebGLProgram
                static currentEffectIdx: number
                effectID: number
                constructor () 
                {
                    this.uniforms               = { };
                    this.attributes             = { };

                    this.vertexShader           =  new renderPro.graphics.gl.Shader();
                    this.fragmentShader         =  new renderPro.graphics.gl.Shader();
                }
                load ( vertexShaderObject : any, fragmentShaderObject : any, gl : WebGLRenderingContext = renderPro.graphics.gl.context )
                {
                    Application.Debug.assert ( vertexShaderObject != null );
                    Application.Debug.assert ( fragmentShaderObject != null );
                    Application.Debug.assert ( gl != null );

                    let isLoaded: boolean       = false;
                    if ( vertexShaderObject != null && fragmentShaderObject != null )
                    {
                        this.vertexShader.load ( vertexShaderObject.content, gl.VERTEX_SHADER);
                        this.fragmentShader.load ( fragmentShaderObject.content, gl.FRAGMENT_SHADER);
                        
                        this.programPointer         = gl.createProgram ( );
                        if ( this.programPointer != -1 )
                        {
                            gl.attachShader ( this.programPointer, this.vertexShader.pointer );
                            gl.attachShader ( this.programPointer, this.fragmentShader.pointer );
                            gl.linkProgram ( this.programPointer );

                            if ( !gl.getProgramParameter ( this.programPointer, gl.LINK_STATUS ) )
                                alert ( "Could not initialise shaders" );
                            else
                            {
                                this.use ( gl );
                                this.loadUniforms(vertexShaderObject.uniforms, fragmentShaderObject.uniforms, gl);
                                this.loadAttributes(vertexShaderObject.attributes, gl);
                                isLoaded            = true;
                            }     
                        }
                    }
        
                    /* Give this effect a unique id */
                    if ( Effect.currentEffectIdx == undefined )
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;

                    this.effectID               = Effect.currentEffectIdx;

                    return isLoaded;
                }

                use ( gl : WebGLRenderingContext = renderPro.graphics.gl.context)
                {
                    Application.Debug.assert ( gl != null );
                    
                    if ( gl != null )
                        gl.useProgram ( this.programPointer );
                }

                /* NOTE(Martin): The following method requires the current program letiable on the gl context object to be set to this program */
                private loadUniforms ( vertexUniforms : Array<any>, fragmentUniforms : Array<any>, gl : WebGLRenderingContext = renderPro.graphics.gl.context) 
                {
                    Application.Debug.assert ( gl != null );
                    Application.Debug.assert ( vertexUniforms != null );
                    Application.Debug.assert ( fragmentUniforms != null );
                    function loadUniformsInternal ( uniforms: Array<any>, retVal: Array<renderPro.graphics.gl.Uniform>, uniformDefaults: any, program: renderPro.graphics.gl.Effect, gl: WebGLRenderingContext = renderPro.graphics.gl.context )
                    {
                        Application.Debug.assert ( gl != null );
                        Application.Debug.assert ( retVal != null );
                        Application.Debug.assert ( program != null );
                        Application.Debug.assert ( uniforms != null );
                        Application.Debug.assert ( uniformDefaults != null );
                        
                        if ( uniforms != null && retVal != null && program != null && gl != null )
                        {
                            for ( let i: number             = 0; i < uniforms.length; i++ )
                            {
                                let uniform: any            = uniforms[ i ];
                                const _uni                  = new renderPro.graphics.gl.Uniform ( uniform.name, uniform.type, gl );
                                _uni.init ( program );
                                if ( _uni.location != -1 && _uni.location != null )
                                {
                                    retVal[ uniform.name ]  = _uni;
                                    if ( uniform.defaultValue != undefined )
                                        _uni.set( uniform.defaultValue );
                                }
                            }
                        }
                    }

                    let uniformDefaults : any           = {};
                    loadUniformsInternal ( vertexUniforms, this.uniforms, uniformDefaults, this );
                    loadUniformsInternal ( fragmentUniforms, this.uniforms, uniformDefaults, this );
                }

                private loadAttributes ( vertexAttributes : Array<any>, gl : WebGLRenderingContext = renderPro.graphics.gl.context)
                {
                    Application.Debug.assert ( gl != null );
                    Application.Debug.assert ( this.attributes != null );
                    Application.Debug.assert ( vertexAttributes != null );

                    for ( let i:number  = 0; i < vertexAttributes.length; i++ )
                    {
                        let attr                                = vertexAttributes[ i ];
                        let attribute                           = new renderPro.graphics.gl.Attribute( attr.name, attr.type, gl );
                        attribute.updateLocation ( this );
                        if ( attribute.location != -1 && attribute.location != null )
                        {
                            attribute.enable ( );
                            this.attributes[ attribute.name ]   =  attribute;
                        }
                    }
                }
            }
        }
    }
}