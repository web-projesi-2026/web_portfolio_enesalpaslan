<?php
session_start();
require_once 'db.php';

// Sadece admin erişebilir
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit;
}

$message = '';

// Araç Ekleme İşlemi
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] == 'add') {
    $make = $_POST['make'];
    $name = $_POST['name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $transmission = $_POST['transmission'];
    $fuel = $_POST['fuel'];
    $seats = $_POST['seats'];
    $power = $_POST['power'];
    $image_url = $_POST['image_url'];
    $badge = !empty($_POST['badge']) ? $_POST['badge'] : NULL;

    $stmt = $pdo->prepare("INSERT INTO cars (make, name, category, price, transmission, fuel, seats, power, image_url, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$make, $name, $category, $price, $transmission, $fuel, $seats, $power, $image_url, $badge])) {
        $message = "Araç başarıyla eklendi.";
    } else {
        $message = "Araç eklenirken hata oluştu.";
    }
}

// Araç Silme İşlemi
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    $stmt = $pdo->prepare("DELETE FROM cars WHERE id = ?");
    if ($stmt->execute([$id])) {
        $message = "Araç silindi.";
    }
}

// Araçları Listele
$stmt = $pdo->query("SELECT * FROM cars ORDER BY id DESC");
$cars = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VELOX — Yönetim Paneli</title>
<link href="https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Barlow+Condensed:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<style>
  body { padding: 40px; background: var(--bg); }
  .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid var(--border); padding-bottom: 20px; }
  .admin-title { font-family: 'Racing Sans One', cursive; font-size: 36px; color: var(--red); }
  .btn-logout { background: var(--surface2); border: 1px solid var(--border); padding: 10px 20px; color: var(--text); text-decoration: none; font-family: 'Barlow Condensed'; font-weight: bold; text-transform: uppercase; }
  .btn-logout:hover { background: var(--red); color: #fff; }
  .grid-container { display: grid; grid-template-columns: 350px 1fr; gap: 40px; }
  .panel-box { background: var(--surface); padding: 30px; border: 1px solid var(--border); border-top: 3px solid var(--red); }
  .panel-title { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; color: var(--text); }
  .f-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .f-group label { font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: bold; }
  .f-group input, .f-group select { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 10px; outline: none; }
  .btn-submit { background: var(--red); color: #fff; border: none; padding: 12px; width: 100%; font-weight: bold; text-transform: uppercase; cursor: pointer; margin-top: 10px; }
  .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); font-size: 14px; }
  .table th { color: var(--red); font-family: 'Barlow Condensed'; font-weight: bold; text-transform: uppercase; }
  .btn-delete { color: #ff4444; text-decoration: none; font-weight: bold; }
  .btn-delete:hover { text-decoration: underline; }
  .msg { padding: 10px; background: rgba(0,255,0,0.1); color: #00cc66; border: 1px solid #00cc66; margin-bottom: 20px; }
</style>
</head>
<body>

<div class="admin-header">
  <div class="admin-title">VELOX PİT DUVARI (ADMİN)</div>
  <div>
    <span>Hoş geldin, <?= htmlspecialchars($_SESSION['full_name']) ?></span> &nbsp;|&nbsp;
    <a href="index.html" class="btn-logout">Siteye Dön</a>
    <a href="logout.php" class="btn-logout" style="margin-left: 10px;">Çıkış Yap</a>
  </div>
</div>

<?php if($message): ?><div class="msg"><?= htmlspecialchars($message) ?></div><?php endif; ?>

<div class="grid-container">
  <!-- Ekleme Formu -->
  <div class="panel-box">
    <div class="panel-title">Yeni Araç Ekle</div>
    <form method="POST">
      <input type="hidden" name="action" value="add">
      <div class="f-group">
        <label>Marka</label>
        <input type="text" name="make" required placeholder="Örn: BMW">
      </div>
      <div class="f-group">
        <label>Model</label>
        <input type="text" name="name" required placeholder="Örn: 320i">
      </div>
      <div class="f-group">
        <label>Kategori</label>
        <select name="category" required>
          <option value="ekonomi">Ekonomi</option>
          <option value="suv">SUV</option>
          <option value="luks">Lüks</option>
          <option value="elektrik">Elektrikli</option>
        </select>
      </div>
      <div class="f-group">
        <label>Günlük Fiyat (₺)</label>
        <input type="number" name="price" required placeholder="Örn: 1500">
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="f-group">
          <label>Vites</label>
          <input type="text" name="transmission" value="Otomatik">
        </div>
        <div class="f-group">
          <label>Yakıt</label>
          <input type="text" name="fuel" value="Benzin">
        </div>
        <div class="f-group">
          <label>Koltuk</label>
          <input type="number" name="seats" value="5">
        </div>
        <div class="f-group">
          <label>Motor Gücü</label>
          <input type="text" name="power" value="150 bg">
        </div>
      </div>
      <div class="f-group">
        <label>Görsel URL</label>
        <input type="text" name="image_url" required placeholder="https://...">
      </div>
      <div class="f-group">
        <label>Etiket (Opsiyonel)</label>
        <input type="text" name="badge" placeholder="Örn: ⭐ Yeni">
      </div>
      <button type="submit" class="btn-submit">Aracı Ekle</button>
    </form>
  </div>

  <!-- Araç Listesi -->
  <div class="panel-box" style="overflow-x: auto;">
    <div class="panel-title">Filo Listesi</div>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Görsel</th>
          <th>Marka / Model</th>
          <th>Kategori</th>
          <th>Fiyat</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach($cars as $car): ?>
        <tr>
          <td><?= $car['id'] ?></td>
          <td><img src="<?= htmlspecialchars($car['image_url']) ?>" style="width: 50px; height: 30px; object-fit: cover;"></td>
          <td><?= htmlspecialchars($car['make'] . ' ' . $car['name']) ?></td>
          <td><?= htmlspecialchars(ucfirst($car['category'])) ?></td>
          <td>₺<?= number_format($car['price'], 0, ',', '.') ?></td>
          <td>
            <a href="?delete=<?= $car['id'] ?>" class="btn-delete" onclick="return confirm('Bu aracı silmek istediğinize emin misiniz?');">Sil</a>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

</body>
</html>
