<?php
// db.php
$host = 'sql308.infinityfree.com';
$dbname = 'if0_41840384_velox2';
$username = 'if0_41840384';
$password = ''; // Şifreyi buraya yazma! // InfinityFree vPanel şifren

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Hata modunu exception olarak ayarla
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Varsayılan fetch modunu assoc yap
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die("Veritabanı bağlantı hatası: " . $e->getMessage());
}
?>
