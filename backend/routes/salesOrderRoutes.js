import express from "express";
import db from "../db.js";

const router = express.Router();

// GET All Sales Orders
router.get("/", (req, res) => {
  const sql = "SELECT * FROM sales_orders";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// GET One Sales Order with Details
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sqlOrder = "SELECT * FROM sales_orders WHERE id = ?";
  const sqlDetail = "SELECT * FROM sales_order_details WHERE sales_order_id = ?";
  db.query(sqlOrder, [id], (err, orderResult) => {
    if (err) return res.status(500).send(err);
    db.query(sqlDetail, [id], (err, detailResult) => {
      if (err) return res.status(500).send(err);
      res.json({ order: orderResult[0], details: detailResult });
    });
  });
});

// CREATE Sales Order
router.post("/", (req, res) => {
  const { bisnis_unit, no_so, customer, tanggal_so, alasan, catatan, status, details } = req.body;

  const sqlOrder = "INSERT INTO sales_orders (bisnis_unit, no_so, customer, tanggal_so, alasan, catatan, status) VALUES (?,?,?,?,?,?,?)";
  db.query(sqlOrder, [bisnis_unit, no_so, customer, tanggal_so, alasan, catatan, status], (err, result) => {
    if (err) return res.status(500).send(err);
    const salesOrderId = result.insertId;

    const sqlDetail = "INSERT INTO sales_order_details (sales_order_id, kode, nama_item, qty_so, qty_do, qty_blm_terkirim, qty_closing, satuan, catatan) VALUES ?";
    const values = details.map(d => [salesOrderId, d.kode, d.nama_item, d.qty_so, d.qty_do, d.qty_blm_terkirim, d.qty_closing, d.satuan, d.catatan]);
    db.query(sqlDetail, [values], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.json({ message: "Sales Order Created Successfully" });
    });
  });
});

// UPDATE Sales Order
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { bisnis_unit, no_so, customer, tanggal_so, alasan, catatan, status, details } = req.body;

  const sqlOrder = "UPDATE sales_orders SET bisnis_unit=?, no_so=?, customer=?, tanggal_so=?, alasan=?, catatan=?, status=? WHERE id=?";
  db.query(sqlOrder, [bisnis_unit, no_so, customer, tanggal_so, alasan, catatan, status, id], (err) => {
    if (err) return res.status(500).send(err);
    db.query("DELETE FROM sales_order_details WHERE sales_order_id=?", [id], (err2) => {
      if (err2) return res.status(500).send(err2);
      const sqlDetail = "INSERT INTO sales_order_details (sales_order_id, kode, nama_item, qty_so, qty_do, qty_blm_terkirim, qty_closing, satuan, catatan) VALUES ?";
      const values = details.map(d => [id, d.kode, d.nama_item, d.qty_so, d.qty_do, d.qty_blm_terkirim, d.qty_closing, d.satuan, d.catatan]);
      db.query(sqlDetail, [values], (err3) => {
        if (err3) return res.status(500).send(err3);
        res.json({ message: "Sales Order Updated Successfully" });
      });
    });
  });
});

// DELETE Sales Order
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM sales_orders WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Sales Order Deleted Successfully" });
  });
});

export default router;
