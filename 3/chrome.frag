    precision mediump float;

    varying vec3 normalDirection;
    varying vec3 viewDirection;
    uniform samplerCube uSampler;

    void main( void )
    {
    vec3 reflectedDirection =
                   reflect(viewDirection, normalize(normalDirection));
       gl_FragColor = textureCube(uSampler, reflectedDirection);
       //gl_FragColor = vec4(normalDirection, 1.0);
    }

