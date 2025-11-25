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

        // ノイズ関数 (簡易版)
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
            // マウス座標を -1.0~1.0 から 0.0~1.0 に変換
            vec2 mousePos = uMouse * 0.5 + 0.5;
            
            // アスペクト比補正（正円の歪みにするため）
            float aspect = uResolution.x / uResolution.y;
            vec2 aspectUv = vUv;
            aspectUv.x *= aspect;
            vec2 aspectMouse = mousePos;
            aspectMouse.x *= aspect;

            // マウスからの距離
            float dist = distance(aspectUv, aspectMouse);
            
            // 歪みの強度（マウスに近いほど強い）
            float strength = smoothstep(0.6, 0.0, dist) * 1.5; // 範囲0.6, 強度1.5
            
            // 歪ませたUV座標
            vec2 uv = vUv - (vUv - mousePos) * strength * 0.05;

            // グラデーション生成
            // 歪んだUVを使ってノイズを生成することで、空間が歪んでいるように見せる
            float n = random(uv + uTime * 0.1);
            
            // 緩やかなグラデーション
            float gradient = distance(uv, vec2(0.5));
            
            vec3 color1 = vec3(0.99, 0.99, 0.99); // ほぼ純白
            vec3 color2 = vec3(0.92, 0.92, 0.93); // 影色（グレー）
            
            // ノイズとグラデーションを混ぜる
            float mixValue = gradient + n * 0.05;
            vec3 finalColor = mix(color1, color2, smoothstep(0.0, 1.2, mixValue));

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

    // 【デバッグ用】回転する赤いキューブを追加（WebGL動作確認用）
    // ※これが表示されたらレンダラーは正常
    const debugGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const debugMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const debugMesh = new THREE.Mesh(debugGeo, debugMat);
    // scene.add(debugMesh); // ← 本番ではコメントアウト、今はテストのため有効化
    scene.add(debugMesh);

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

        // デバッグ用キューブを回転
        if (debugMesh) {
            debugMesh.rotation.x += 0.01;
            debugMesh.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
    }

    animate();
    console.log('WebGL initialized successfully.');
});

