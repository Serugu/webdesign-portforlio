<?php
// メール送信のダミー処理
header('Content-Type: application/json');

// 本番ではここで mail() 関数などを使う
$response = [
    'status' => 'success',
    'message' => 'Thank you! Your message has been sent (simulation).'
];

echo json_encode($response);
exit;

