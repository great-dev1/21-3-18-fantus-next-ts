import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script
            type="x-shader/x-vertex"
            id="vertexshader"
            dangerouslySetInnerHTML={{
              __html: `attribute float scale;void main() {vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );gl_PointSize = scale * ( 300.0 / - mvPosition.z );gl_Position = projectionMatrix * mvPosition;}`,
            }}
          ></script>
          <script
            type="x-shader/x-fragment"
            id="fragmentshader"
            dangerouslySetInnerHTML={{
              __html: `uniform vec3 color;void main() {if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;gl_FragColor = vec4( color, 1.0 );}`,
            }}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
