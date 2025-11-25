<?php
// 設定や共通関数があればここに記述
$page_title = "Portfolio | Web Designer";
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="静寂の中の躍動 - Webデザイナー ポートフォリオサイト">
    
    <!-- Google Fonts (後で調整) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Didot:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&family=Noto+Serif+JP:wght@300;400;600&display=swap" rel="stylesheet">

    <!-- Reset & Main CSS -->
    <!-- 実際の運用ではSCSSをコンパイルしたstyle.cssを読み込む -->
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body>

    <!-- Loading (JavaScriptで制御) -->
    <div class="loader" id="js-loader">
        <span class="loader__text">Loading...</span>
    </div>

    <!-- Smooth Scroll Wrapper (Lenis用) -->
    <div class="wrapper" id="js-wrapper">
        
        <?php include 'parts/header.php'; ?>

        <main class="main-content">
            <?php include 'parts/hero.php'; ?>
            <?php include 'parts/about.php'; ?>
            <?php include 'parts/works.php'; ?>
            <?php include 'parts/skills.php'; ?>
            <?php include 'parts/contact.php'; ?>
        </main>

        <?php include 'parts/footer.php'; ?>

    </div>

    <!-- Libraries (CDN for prototyping) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.29/dist/lenis.min.js"></script>

    <!-- Main Script -->
    <script src="./assets/js/main.js" type="module"></script>
</body>
</html>
