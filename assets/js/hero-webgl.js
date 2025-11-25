/**
 * Hero Section - WebGL Background (Distortion Effect)
 * マウスの動きに追従して歪むグラデーション背景
 */

// WebGLの初期化処理を window.load 後に実行
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.warn('Hero canvas not found.');
        return;
    }

    // Three.jsの確認
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded. WebGL disabled.');
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

        // グリッド生成関数
        float grid(vec2 st, float res) {
            vec2 grid = fract(st * res);
            return (step(0.98, grid.x) + step(0.98, grid.y));
        }

        void main() {
            vec2 mouse = uMouse * 0.5 + 0.5;
            vec2 uv = vUv;
            
            // アスペクト比補正
            float aspect = uResolution.x / uResolution.y;
            vec2 aspectUv = uv;
            aspectUv.x *= aspect;
            vec2 aspectMouse = mouse;
            aspectMouse.x *= aspect;

            // マウス位置を中心とした距離
            vec2 diff = aspectUv - aspectMouse;
            float dist = length(diff);

            // 歪み（強力な引き寄せ効果）
            float pull = smoothstep(0.5, 0.0, dist);
            uv += normalize(diff) * pull * 0.05;

            // 背景グリッドを描画 (歪んだUVを使用)
            float gridLine = grid(uv, 20.0); // 20分割のグリッド
            
            // 色の決定
            vec3 baseColor = vec3(0.98); // 背景の白
            vec3 gridColor = vec3(0.85); // グリッドの色（少し濃いグレー）
            
            // 歪みに応じてグリッドを少し光らせる
            gridColor += vec3(0.1) * pull;

            vec3 finalColor = mix(baseColor, gridColor, gridLine * 0.5);
            
            // マウス周辺を少し明るく
            finalColor += vec3(0.05) * pull;

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

        material.uniforms.uTime.value = clock.getElapsedTime();
        material.uniforms.uMouse.value.set(mouse.x, mouse.y);

        renderer.render(scene, camera);
    }

    animate();
    console.log('WebGL initialized successfully.');
});

