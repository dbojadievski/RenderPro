( function ( ) 
{
    function Renderable ( mesh, texture, material, state, effect )
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

    Renderable.prototype.bufferData = function renderable_bufferData ( gl )
    {
        var positions               = new Array ( );
        var textureCoordinates      = new Array ( );
        var normals                 = new Array ( );
        
        for ( var currVertexIdx     = 0; currVertexIdx < this.mesh.vertices.length; currVertexIdx++ )
        {
            positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 0 ] );
            positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 1 ] );
            positions.push ( this.mesh.vertices[ currVertexIdx ].position[ 2 ] );

            textureCoordinates.push ( this.mesh.vertices[ currVertexIdx ].uv[ 0 ] );
            textureCoordinates.push ( this.mesh.vertices[ currVertexIdx ].uv[ 1 ] );

            normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 0 ] );
            normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 1 ] );
            normals.push ( this.mesh.vertices[ currVertexIdx ].normal[ 2 ] );
        }

        this.vertexBuffer           = new renderPro.graphics.gl.ArrayBuffer ( );
        this.vertexBuffer.bufferData ( positions );

        if ( textureCoordinates.length > 0 )
        {
            this.uvBuffer           = new renderPro.graphics.gl.ArrayBuffer (  );
            this.uvBuffer.bufferData ( textureCoordinates );
        }
        
        this.normalBuffer           = new renderPro.graphics.gl.ArrayBuffer ( gl );
        this.normalBuffer.bufferData ( normals );

        this.indexBuffer            = new renderPro.graphics.gl.ElementArrayBuffer ( gl );
        this.indexBuffer.bufferData ( this.mesh.indices );
    };

    Renderable.prototype.draw       = function renderable_draw ( shaderProgram, gl )
    {
        gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
        gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], this.mesh.vertexSize, gl.FLOAT, false, 0, 0 );

        if ( this.mesh.vertices[ 0 ].uv != undefined )
        {
            gl.bindBuffer ( gl.ARRAY_BUFFER, this.uvBuffer.pointer );
            gl.vertexAttribPointer ( shaderProgram.attributes["vertexTextureCoordinate"], 2, gl.FLOAT, false, 0, 0 );
        }
        else
            gl.enableVertexAttribArray ( shaderProgram.attributes[ "vertexTextureCoordinate" ] );

        gl.activeTexture ( gl.TEXTURE0 );
        gl.bindTexture ( gl.TEXTURE_2D, this.texture.texture );

        gl.bindBuffer ( gl.ARRAY_BUFFER, this.normalBuffer.pointer );
        gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexNormal" ], 3, gl.UNSIGNED_SHORT, false, 0, 0 );

        gl.bindBuffer ( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer.pointer );
        gl.drawElements ( gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0 );

        // gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
        // gl.drawArrays ( gl.TRIANGLES, 0, this.mesh.indices.length );
        gl.bindBuffer ( gl.ARRAY_BUFFER, null );
    };

    Renderable.prototype.drawWithoutStateChanges = function renderable_drawWithoutStateChanges ( shaderProgram, gl )
    {
        gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
        gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], 3, gl.FLOAT, false, 0, 0 );

        if ( this.mesh.vertices[ 0 ].uv != undefined )
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
    };

    Renderable.prototype.drawUnindexed = function renderable_drawUnindexed ( shaderProgram , gl )
    {
        gl.bindBuffer ( gl.ARRAY_BUFFER, this.vertexBuffer.pointer );
        gl.vertexAttribPointer ( shaderProgram.attributes[ "vertexPosition" ], 3, gl.FLOAT, false, 0, 0 );

        if ( this.mesh.vertices[ 0 ].uv != undefined )
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
    };

    Renderable.prototype.unload     = function renderable_unload ( gl )
    {
        this.uvBuffer.free ( gl );
        this.indexBuffer.free ( gl );
        this.vertexBuffer.free ( gl );

        this.uvBuffer               = null;
        this.indexBuffer            = null;
        this.vertexBuffer           = null;
    };

    renderPro.graphics.gl.Renderable   = Renderable;
} ) ( );