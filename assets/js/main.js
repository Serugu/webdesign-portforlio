// ライブラリの登録 (CDNを使っているのでwindowオブジェクトから取得)
gsap.registerPlugin(ScrollTrigger);

// Loading処理
window.addEventListener("load", () => {
    const loader = document.getElementById("js-loader");
    if (loader) {
        // 少し待ってから消す（演出用）
        setTimeout(() => {
            loader.classList.add("is-hidden");
            // ローディング完了後にアニメーションを開始するならここに記述
        }, 800);
    }
});

// Lenis (慣性スクロール) の初期化
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAPとLenisの連携 (スクロール位置の同期)
// ※GSAPのScrollTriggerがLenisのスクロールイベントをリッスンするように設定する処理が必要な場合があるが、
// 最近のバージョンでは自動で動くことが多い。動きが怪しい場合は設定を追加する。

console.log("System Initialized: Lenis & GSAP active.");

// --- アニメーションの実装エリア ---

// Worksセクションの横スクロール
const worksContainer = document.querySelector("#js-works-container");
const worksSection = document.querySelector("#works");

if (worksContainer && worksSection) {
    // 横幅の計算：コンテナの全幅 - 画面幅 = 移動すべき距離
    const scrollWidth = worksContainer.scrollWidth - window.innerWidth;

    gsap.to(worksContainer, {
        x: -scrollWidth, // 左へ移動
        ease: "none",
        scrollTrigger: {
            trigger: worksSection,
            start: "top top", // セクションの上部が画面上部に着いた時
            end: () => `+=${scrollWidth}`, // スクロール量 = 移動距離
            pin: true, // 画面を固定
            scrub: 1, // スクロールに合わせて動かす（数値は慣性）
            invalidateOnRefresh: true, // リサイズ時に再計算
            // markers: true // デバッグ用マーカー (本番では消す)
        }
    });
}

