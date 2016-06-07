    varying vec3 normalDirection;
    varying vec3 viewDirection;

    void main(void)
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        normalDirection = normalize(normal * mat3(modelMatrix));
        vec3 PositionWorld = vec3(modelMatrix * vec4(position, 1.0));
        viewDirection = normalize(PositionWorld - cameraPosition);
    }


