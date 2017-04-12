namespace renderPro {
    export namespace graphics {
        export class Effect {
            uniforms: any
            attributes: any
            vertexShader: WebGLShader
            fragmentShader: WebGLShader
            programPointer: WebGLProgram
            static currentEffectIdx: number
            effectID: number
            constructor ( vertexShader : WebGLShader, fragmentShader : WebGLShader, gl : WebGLRenderingContext )
            {
                this.uniforms               = [ ];
                this.attributes             = [ ];

                this.vertexShader           = vertexShader;
                this.fragmentShader         = fragmentShader;
                
                this.programPointer         = gl.createProgram ( );

                if ( Effect.currentEffectIdx == undefined )
                    Effect.currentEffectIdx = 1;
                else
                    Effect.currentEffectIdx++;

                this.effectID               = Effect.currentEffectIdx;

                gl.attachShader ( this.programPointer, this.vertexShader );
                gl.attachShader ( this.programPointer, this.fragmentShader );
                gl.linkProgram ( this.programPointer );
            }
            use ( gl : WebGLRenderingContext )
            {
                gl.useProgram ( this.programPointer );
            }

        }
    }
}