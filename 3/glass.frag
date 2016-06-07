    precision mediump float;

    varying vec3 normalDirection;
    varying vec3 viewDirection;
    uniform samplerCube uSampler;
    uniform float coeff;

    void main( void )
    {
    vec3 reflectedDirection =
                   refract(viewDirection, normalDirection, coeff);
     gl_FragColor = textureCube(uSampler, reflectedDirection);
     //gl_FragColor = vec4(normalDirection, 1.0);
    }

