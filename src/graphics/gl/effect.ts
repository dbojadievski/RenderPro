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
                    this.vertexShader.load ( vertexShaderObject.content, gl.VERTEX_SHADER);
                    this.fragmentShader.load ( fragmentShaderObject.content, gl.FRAGMENT_SHADER);

                    /* Create a shader program and attach the vertex and fragment shader to this program */
                    this.programPointer         = gl.createProgram ( );
                    gl.attachShader ( this.programPointer, this.vertexShader.pointer );
                    gl.attachShader ( this.programPointer, this.fragmentShader.pointer );
                    gl.linkProgram ( this.programPointer );

                    if ( !gl.getProgramParameter ( this.programPointer, gl.LINK_STATUS ) )
                    {
                        alert ( "Could not initialise shaders" );
                        return null;
                    }     

                    this.use ( gl );
                    this.loadUniforms(vertexShaderObject.uniforms, fragmentShaderObject.uniforms, gl);
                    this.loadAttributes(vertexShaderObject.attributes, fragmentShaderObject.attributes, gl);
        
                    /* Give this effect a unique id */
                    if ( Effect.currentEffectIdx == undefined )
                        Effect.currentEffectIdx = 1;
                    else
                        Effect.currentEffectIdx++;

                    this.effectID               = Effect.currentEffectIdx;

                }
                use ( gl : WebGLRenderingContext = renderPro.graphics.gl.context)
                {
                    gl.useProgram ( this.programPointer );
                }
                /* NOTE(Martin): The following method requires the current program letiable on the gl context object to be set to this program */
                private loadUniforms ( vertexUniforms : Array<any>, fragmentUniforms : Array<any>, gl : WebGLRenderingContext = renderPro.graphics.gl.context) 
                {

                    function loadUniformsInternal ( uniforms: Array<any>, retVal: Array<renderPro.graphics.gl.Uniform>, uniformDefaults: any, program: renderPro.graphics.gl.Effect, gl: WebGLRenderingContext = renderPro.graphics.gl.context )
                    {
                        Application.Debug.assert ( retVal != null );
                        
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

                    var uniforms                        = new Array<renderPro.graphics.gl.Uniform> ( );
                    let uniformDefaults : any           = {};
                    loadUniformsInternal ( vertexUniforms, uniforms, uniformDefaults, this );
                    loadUniformsInternal ( fragmentUniforms, uniforms, uniformDefaults, this );
                    
                    for ( var uniformName in uniforms )
                        this.uniforms[ uniformName ]    = uniforms[ uniformName ];    
                }

                private loadAttributes ( vertexAttribute : Array<any>, fragmentAttribute : Array<any>, gl : WebGLRenderingContext = renderPro.graphics.gl.context)
                {
                    /* Create attribute objects for vertex shader */
                    for ( let i : number = 0; i < vertexAttribute.length; i++ )
                    {
                        let attribute                           = vertexAttribute[i];
                        this.attributes[ attribute.name ]       = new renderPro.graphics.gl.Attribute( attribute.name, attribute.type, gl );
                    }

                    /* Create attribute objects for fragment shader */
                    for ( let i : number = 0; i < fragmentAttribute.length; i++ )
                    {
                        let attribute                           = fragmentAttribute[ i ];
                        this.attributes[ attribute.name ]       = new renderPro.graphics.gl.Attribute( attribute.name, attribute.type, gl );
                    }

                    /* Initiate each attribute */
                    for ( let attrName in this.attributes ) 
                    {
                        if ( this.attributes.hasOwnProperty( attrName ) ) 
                        {
                            this.attributes[ attrName ].updateLocation( this );
                            this.attributes[ attrName ].enable( );
                        }
                    }
                }

            }
        }
    }
}