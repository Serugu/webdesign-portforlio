console.log("Main script loaded. Checking libraries...");

// 初期化関数
const initApp = () => {
    // GSAPの確認と登録
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.log("GSAP & ScrollTrigger: Registered");
    } else {
        console.warn("GSAP or ScrollTrigger not found. Animations disabled.");
    }

    // Lenisの初期化
    let lenis;
    if (typeof Lenis !== 'undefined') {
        try {
            lenis = new Lenis({
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
            console.log("Lenis: Initialized");
        } catch (e) {
            console.error("Lenis init failed:", e);
        }
    } else {
        console.error("Lenis library not found. Smooth scroll disabled.");
    }

    // --- アニメーションの実装エリア ---
    
    // Worksセクションの横スクロール
    const worksContainer = document.querySelector("#js-works-container");
    const worksSection = document.querySelector("#works");

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && worksContainer && worksSection) {
        // 横幅の計算：コンテナの全幅 - 画面幅 = 移動すべき距離
        const calculateScroll = () => worksContainer.scrollWidth - window.innerWidth;
        
        gsap.to(worksContainer, {
            x: () => -calculateScroll(), // 関数にすることでリサイズ対応
            ease: "none",
            scrollTrigger: {
                trigger: worksSection,
                start: "top top",
                end: () => `+=${calculateScroll()}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }
};

// Loading処理
window.addEventListener("load", () => {
    const loader = document.getElementById("js-loader");
    if (loader) {
        setTimeout(() => {
            loader.classList.add("is-hidden");
        }, 800);
    }
    
    // ページ読み込み完了後にアプリを初期化
    initApp();
});
