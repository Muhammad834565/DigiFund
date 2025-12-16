-- Update invoice_date column from DATE to TIMESTAMP
ALTER TABLE invoices_master ALTER COLUMN invoice_date TYPE TIMESTAMP;
