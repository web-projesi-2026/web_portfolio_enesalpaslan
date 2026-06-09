<?php
session_start();
require_once 'db.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($fullName) || empty($email) || empty($password)) {
        $error = 'Lütfen tüm alanları doldurun.';
    } else {
        // E-posta var mı kontrol et
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'Bu e-posta adresi zaten kullanımda.';
        } else {
            // Şifreyi hashle
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, 'user')");
            if ($stmt->execute([$fullName, $email, $hashedPassword])) {
                $success = 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.';
            } else {
                $error = 'Kayıt sırasında bir hata oluştu.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VELOX — Kayıt Ol</title>
<link href="https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Barlow+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<style>
  body { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .auth-box { background: var(--surface); padding: 40px; border: 1px solid var(--border); border-top: 3px solid var(--red); width: 100%; max-width: 400px; }
  .auth-title { font-family: 'Racing Sans One', cursive; font-size: 28px; margin-bottom: 24px; text-align: center; }
  .f-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .f-group label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
  .f-group input { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 12px; font-family: sans-serif; outline: none; }
  .f-group input:focus { border-color: var(--red); }
  .btn-submit { width: 100%; background: var(--red); color: #fff; border: none; padding: 14px; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
  .btn-submit:hover { background: var(--red2); }
  .msg { padding: 10px; margin-bottom: 16px; font-size: 13px; text-align: center; }
  .msg.err { background: rgba(255,0,0,0.1); color: #ff4444; border: 1px solid #ff4444; }
  .msg.succ { background: rgba(0,255,0,0.1); color: #00cc66; border: 1px solid #00cc66; }
  .auth-links { text-align: center; margin-top: 20px; font-size: 13px; }
  .auth-links a { color: var(--red); text-decoration: none; }
</style>
</head>
<body>
<div class="auth-box">
  <div class="auth-title">VELOX'A KATIL</div>
  <?php if($error): ?><div class="msg err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
  <?php if($success): ?><div class="msg succ"><?= htmlspecialchars($success) ?></div><?php endif; ?>
  <form method="POST">
    <div class="f-group">
      <label>Ad Soyad</label>
      <input type="text" name="full_name" required>
    </div>
    <div class="f-group">
      <label>E-posta</label>
      <input type="email" name="email" required>
    </div>
    <div class="f-group">
      <label>Şifre</label>
      <input type="password" name="password" required>
    </div>
    <button type="submit" class="btn-submit">Kayıt Ol</button>
  </form>
  <div class="auth-links">
    Zaten hesabınız var mı? <a href="login.php">Giriş Yap</a><br><br>
    <a href="index.html">Ana Sayfaya Dön</a>
  </div>
</div>
</body>
</html>
