"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
    return <GrainShader />;
}

function GrainShader() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      void main() {
          vec2 st = gl_FragCoord.xy / resolution.xy;
          float r = random(st + time);
          // 4% monochrome noise means mostly transparent, with some white/black specs?



          float noise = (r - 0.5) * 0.08;





          gl_FragColor = vec4(vec3(noise + 0.5), 0.07);
      }
    `;


        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, "time");
        const resolutionLocation = gl.getUniformLocation(program, "resolution");

        let startTime = Date.now();
        let frameId: number;

        const render = () => {
            resize();
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frameId = requestAnimationFrame(render);
        };

        const resize = () => {
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
            }
        }

        render();

        return () => {
            cancelAnimationFrame(frameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[9999] mix-blend-overlay opacity-50"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
}
