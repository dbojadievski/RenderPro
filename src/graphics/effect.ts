namespace renderPro {
    export namespace graphics {
        export class Effect {
            uniforms: any
            attributes: any
            vertexShader: any
            fragmentShader: any
            programPointer: any
            static currentEffectIdx: number
            effectID: number
            constructor ( vertexShader : any, fragmentShader : any, gl : any )
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
            use ( gl : any )
            {
                gl.useProgram ( this.programPointer );
            }

        }
    }
}