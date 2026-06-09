<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM cars ORDER BY id DESC");
    $cars = $stmt->fetchAll();
    
    // Veritabanı sütun isimlerini front-end'in beklediği JSON yapısına uyarlıyoruz
    $formatted_cars = [];
    foreach ($cars as $car) {
        $formatted_cars[] = [
            'id' => (string)$car['id'], // String ID for fav check
            'make' => $car['make'],
            'name' => $car['name'],
            'cat' => $car['category'],
            'price' => (int)$car['price'],
            'trans' => $car['transmission'],
            'fuel' => $car['fuel'],
            'seats' => (int)$car['seats'],
            'power' => $car['power'],
            'image' => $car['image_url'],
            'badge' => $car['badge']
        ];
    }
    
    echo json_encode($formatted_cars, JSON_UNESCAPED_UNICODE);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
