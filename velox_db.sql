-- velox_db.sql
CREATE DATABASE IF NOT EXISTS velox_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE velox_db;

-- Users tablosu (Admin ve normal kullanıcılar için)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Örnek Admin Hesabı (Şifre: 123456)
-- (Gerçek projede şifreler hash'lenmiş tutulur. Bu örnekte bcrypt kullanılarak '123456' hashlenmiştir)
INSERT INTO `users` (`full_name`, `email`, `password`, `role`) VALUES
('Admin Enes', 'admin@velox.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Cars tablosu
CREATE TABLE IF NOT EXISTS `cars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `make` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('ekonomi','suv','luks','elektrik') NOT NULL,
  `price` int(11) NOT NULL,
  `transmission` varchar(50) DEFAULT 'Otomatik',
  `fuel` varchar(50) DEFAULT 'Benzin',
  `seats` int(11) DEFAULT 5,
  `power` varchar(50) DEFAULT '100 bg',
  `image_url` varchar(255) NOT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Örnek Araçlar (Önceki products.json verileri)
INSERT INTO `cars` (`make`, `name`, `category`, `price`, `transmission`, `fuel`, `seats`, `power`, `image_url`, `badge`) VALUES
('Toyota', 'Corolla', 'ekonomi', 850, 'Otomatik', 'Hibrit', 5, '122 bg', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80&fit=crop', '⭐ Popüler'),
('Toyota', 'RAV4', 'suv', 1250, 'Otomatik', 'Hibrit', 5, '218 bg', 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=600&q=80&fit=crop', 'Yeni Sezon'),
('Mercedes-Benz', 'E-Class', 'luks', 2900, 'Otomatik', 'Benzin', 5, '258 bg', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80&fit=crop', NULL),
('BMW', '5 Serisi', 'luks', 3500, 'Otomatik', 'Benzin', 5, '286 bg', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80&fit=crop', '🔥 Çok İstenen'),
('Ford', 'Explorer', 'suv', 1800, 'Otomatik', 'Benzin', 7, '300 bg', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80&fit=crop', NULL),
('Volkswagen', 'Polo', 'ekonomi', 650, 'Manuel', 'Dizel', 5, '95 bg', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80&fit=crop', '💰 En Uygun'),
('Tesla', 'Model 3', 'elektrik', 2200, 'Otomatik', 'Elektrik', 5, '358 bg', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80&fit=crop', '⚡ Elektrik'),
('Jeep', 'Wrangler', 'suv', 2100, 'Otomatik', 'Benzin', 5, '272 bg', 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80&fit=crop', NULL),
('Audi', 'A6', 'luks', 3200, 'Otomatik', 'Dizel', 5, '245 bg', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80&fit=crop', NULL);
