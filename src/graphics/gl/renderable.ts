namespace renderPro {
    export namespace graphics {
        export namespace gl {
            export class Renderable {
                mesh    : renderPro.graphics.core.Mesh
                effect : renderPro.graphics.Effect
                texture : renderPro.graphics.core.Texture
                state : renderPro.graphics.core.State
                material: renderPro.graphics.core.Material
                renderableID: number
                vertexBuffer: renderPro.graphics.gl.ArrayBuffer
                uvBuffer: renderPro.graphics.gl.ArrayBuffer
                indexBuffer: renderPro.graphics.gl.ElementArrayBuffer 
                normalBuffer: renderPro.graphics.gl.ArrayBuffer
                static _renderableIdentifier : number
                constructor ( mesh : renderPro.graphics.core.Mesh, texture : renderPro.graphics.core.Texture, material : renderPro.graphics.core.Material, state : renderPro.graphics.core.State, effect : renderPro.graphics.Effect )
                {
                    this.mesh                    = mesh;

                    this.effect                 = effect;
                    this.texture                = texture;
                    this.material               = material;
                    
                    this.state                  = state;

                    /* Note(Dino): This sets up a static variable used to dispatch mesh IDs. Don't mess with it. */
                    if ( Renderable._renderableIdentifier == undefined )
                        Renderable._renderableIdentifier = 1;

                    this.renderableID           = Renderable._renderableIdentifier++;
                }

                bufferData ( gl: WebGLRenderingContext )
                {
                    let positions : Array<any>              = new Array ( );
                    let textureCoordinates : Array<any>     = new Array ( );
                    let normals : Array<any>                = new Array ( );
                    
                    for ( let currVertexIdx : number     = 0; currVertexIdx < this.mesh.vertices.length; currVertexIdx++ )
                    {
                        positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 0 ] );
                        positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 1 ] );
                        positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 2 ] );

                        if (this.mesh.vertices[ currVertexIdx ].uv && this.mesh.vertices[ currVertexIdx ].uv.length === 2) {
                            textureCoordinates.push ( this.mesh.vertices[ currVertexIdx ].uv[ 0 ] );
                            textureCoordinates.push ( this.mesh.vertices[ currVertexIdx ].uv[ 1 ] );
                        }

                        normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 0 ] );
                        normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 1 ] );
                        normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 2 ] );
                    }

                    this.vertexBuffer           = new renderPro.graphics.gl.ArrayBuffer ( gl );
                    this.vertexBuffer.bufferData ( positions );

                    if ( textureCoordinates.length > 0 )
                    {
                        this.uvBuffer           = new renderPro.graphics.gl.ArrayBuffer ( gl );
                        this.uvBuffer.bufferData ( textureCoordinates );
                    }
                    
                    this.normalBuffer           = new renderPro.graphics.gl.ArrayBuffer ( gl );
                    this.normalBuffer.bufferData ( normals );

                    this.indexBuffer            = new renderPro.graphics.gl.ElementArrayBuffer ( gl );
                    this.indexBuffer.bufferData ( this.mesh.indices );
                }
                draw ( shaderProgram : any, gl : WebGLRenderingContext ) : void
                {
                    var that                    = this;
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], this.mesh.vertexSize, gl.FLOAT, false, 0, 0 );

                    if ( this.mesh.vertices.length > 0  && this.mesh.vertices[ 0 ].uv != undefined )
                    {
                        gl.bindBuffer ( gl.ARRAY_BUFFER, this.uvBuffer.pointer );
                        gl.vertexAttribPointer ( shaderProgram.attributes["vertexTextureCoordinate"], 2, gl.FLOAT, false, 0, 0 );
                    }
                    else
                        gl.enableVertexAttribArray ( shaderProgram.attributes[ "vertexTextureCoordinate" ] );

                    gl.activeTexture ( gl.TEXTURE0 );
                    gl.bindTexture ( gl.TEXTURE_2D, this.texture.innerTexture.texture );

                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.normalBuffer.pointer );
                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexNormal" ], 3, gl.UNSIGNED_SHORT, false, 0, 0 );

                    gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.pointer );
                    gl.drawElements ( gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0 );

                    gl.bindBuffer ( gl.ARRAY_BUFFER, null );
                }
                drawWithoutStateChanges ( shaderProgram : any, gl : WebGLRenderingContext ) :  void
                {
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );

                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], 3, gl.FLOAT, false, 0, 0 );

                    if ( this.mesh.vertices.length > 0  && this.mesh.vertices[ 0 ].uv != undefined )
                    {
                        gl.bindBuffer ( gl.ARRAY_BUFFER, this.uvBuffer.pointer );
                        gl.vertexAttribPointer ( shaderProgram.attributes["vertexTextureCoordinate"], 2, gl.FLOAT, false, 0, 0 );
                    }
                    else
                        gl.enableVertexAttribArray ( shaderProgram.attributes[ "vertexTextureCoordinate" ] );
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.normalBuffer.pointer );
                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexNormal" ], 3, gl.UNSIGNED_SHORT, false, 0, 0 );

                    gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.pointer );
                    gl.drawElements ( gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0 );
                    
                    gl.bindBuffer ( gl.ARRAY_BUFFER, null );
                }
                drawUnindexed ( shaderProgram : any, gl : WebGLRenderingContext ) : void
                {
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], 3, gl.FLOAT, false, 0, 0 );

                    if ( this.mesh.vertices.length > 0  && this.mesh.vertices[ 0 ].uv != undefined )    
                    {
                        gl.bindBuffer ( gl.ARRAY_BUFFER, this.uvBuffer.pointer );
                        gl.vertexAttribPointer ( shaderProgram.attributes["vertexTextureCoordinate"], 2, gl.FLOAT, false, 0, 0 );
                    }
                    else
                        gl.enableVertexAttribArray ( shaderProgram.attributes[ "vertexTextureCoordinate" ] );
                    
                    gl.bindBuffer ( gl.ARRAY_BUFFER, this.normalBuffer.pointer );
                    gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexNormal" ], 3, gl.UNSIGNED_SHORT, false, 0, 0 );
                    gl.drawArrays ( gl.TRIANGLES, 0, this.mesh.vertices.length );

                    gl.bindBuffer ( gl.ARRAY_BUFFER, null );
                }
                unload  ( ) : void
                {
                    this.uvBuffer.free ( );
                    this.indexBuffer.free ( );
                    this.vertexBuffer.free ( );

                    this.uvBuffer               = null;
                    this.indexBuffer            = null;
                    this.vertexBuffer           = null;
                }
            }
        }
    }
}