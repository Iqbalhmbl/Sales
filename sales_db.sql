CREATE DATABASE sales_db;
USE sales_db;


CREATE TABLE sales_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bisnis_unit VARCHAR(100),
  no_so VARCHAR(50),
  customer VARCHAR(100),
  tanggal_so DATE,
  alasan VARCHAR(100),
  catatan TEXT,
  status ENUM('DRAFT','CLOSED') DEFAULT 'DRAFT'
);


CREATE TABLE sales_order_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sales_order_id INT,
  kode VARCHAR(50),
  nama_item VARCHAR(100),
  qty_so INT,
  qty_do INT,
  qty_blm_terkirim INT,
  qty_closing INT,
  satuan VARCHAR(20),
  catatan TEXT,
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE
);
