    varying vec3 vTextureCoord;

    void main(void)
    {
        gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
        vTextureCoord = position;
    }


