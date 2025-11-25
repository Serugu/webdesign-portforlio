/**
 * Hero Section - WebGL Background (Distortion Effect)
 * マウスの動きに追従して歪むグラデーション背景
 */

import * as THREE from 'three';

// WebGLの初期化処理を window.load 後に実行
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.warn('Hero canvas not found.');
        return;
    }

    console.log('Initializing WebGL...');

    // シーン、カメラ、レンダラーの作成
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 高DPI対応

    // マウス座標 (正規化: -1.0 ~ 1.0)
    const mouse = { x: 0.0, y: 0.0 };
    const targetMouse = { x: 0.0, y: 0.0 }; // GSAP補間用

    // シェーダーマテリアル
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // ノイズ関数 (簡易版)
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
            // 画面の中心からの距離
            vec2 center = vUv - 0.5;
            
            // マウスの影響を受ける歪み
            vec2 distortion = center * length(uMouse * 0.3);
            vec2 uv = vUv + distortion * 0.1;

            // グラデーション (白からライトグレー)
            float gradient = length(uv - 0.5);
            
            // わずかな動きを加える (時間経過)
            float noise = random(uv + uTime * 0.05) * 0.02;
            
            vec3 color1 = vec3(0.98, 0.98, 0.98); // ほぼ白
            vec3 color2 = vec3(0.94, 0.94, 0.95); // 極薄グレー
            vec3 finalColor = mix(color1, color2, gradient + noise);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2(0.0, 0.0) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }
    });

    // 全画面を覆う平面ジオメトリ
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // マウス移動イベント
    window.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // リサイズ対応
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    // アニメーションループ
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // GSAPライクな補間 (イージング)
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        // Uniformsの更新
        material.uniforms.uTime.value = clock.getElapsedTime();
        material.uniforms.uMouse.value.set(mouse.x, mouse.y);

        renderer.render(scene, camera);
    }

    animate();
    console.log('WebGL initialized successfully.');
});

