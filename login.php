<?php
session_start();
require_once 'db.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        $error = 'Lütfen e-posta ve şifrenizi girin.';
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Giriş başarılı, session oluştur
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['role'] = $user['role'];

            // Role göre yönlendir
            if ($user['role'] === 'admin') {
                header("Location: admin.php");
            } else {
                header("Location: index.html");
            }
            exit;
        } else {
            $error = 'Hatalı e-posta veya şifre.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VELOX — Giriş Yap</title>
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
  .auth-links { text-align: center; margin-top: 20px; font-size: 13px; }
  .auth-links a { color: var(--red); text-decoration: none; }
</style>
</head>
<body>
<div class="auth-box">
  <div class="auth-title">PİT ALANINA GİRİŞ</div>
  <?php if($error): ?><div class="msg err"><?= htmlspecialchars($error) ?></div><?php endif; ?>
  <form method="POST">
    <div class="f-group">
      <label>E-posta</label>
      <input type="email" name="email" required>
    </div>
    <div class="f-group">
      <label>Şifre</label>
      <input type="password" name="password" required>
    </div>
    <button type="submit" class="btn-submit">Giriş Yap</button>
  </form>
  <div class="auth-links">
    Hesabınız yok mu? <a href="register.php">Kayıt Ol</a><br><br>
    <a href="index.html">Ana Sayfaya Dön</a>
  </div>
</div>
</body>
</html>
