    precision mediump float;

    varying vec3 vTextureCoord;
    uniform samplerCube uSampler;

    void main( void )
    {
       gl_FragColor = textureCube(uSampler, vTextureCoord);
    }

