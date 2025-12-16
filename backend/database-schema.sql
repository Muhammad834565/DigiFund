-- ========================================
-- DIGIFUND E-COMMERCE DATABASE SCHEMA
-- PostgreSQL Database
-- ========================================

-- Drop existing tables if needed (use carefully in production)
-- DROP TABLE IF EXISTS login_tokens CASCADE;
-- DROP TABLE IF EXISTS digi_otp CASCADE;
-- DROP TABLE IF EXISTS user_main CASCADE;

-- ========================================
-- MAIN USER TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_main (
    id SERIAL PRIMARY KEY,
    public_id VARCHAR(20) UNIQUE NOT NULL,  -- e.g., gus-001, sup-002, cos-003
    private_id VARCHAR(15) UNIQUE NOT NULL,  -- Random 15 char starting with letter
    company_name VARCHAR(255),
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    status VARCHAR(50) DEFAULT 'active',  -- active, inactive, suspended
    gender VARCHAR(20),  -- male, female, other
    type_of_business VARCHAR(100),
    role VARCHAR(50) NOT NULL,  -- guest_user, supplier, consumer, inventory_manager, financial_manager, student, business_owner
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX idx_user_main_public_id ON user_main(public_id);
CREATE INDEX idx_user_main_private_id ON user_main(private_id);
CREATE INDEX idx_user_main_email ON user_main(email);
CREATE INDEX idx_user_main_phone ON user_main(phone_no);
CREATE INDEX idx_user_main_role ON user_main(role);

-- ========================================
-- LOGIN TOKENS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS login_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_main(id) ON DELETE CASCADE,
    public_id VARCHAR(20) NOT NULL,
    private_id VARCHAR(15) NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_login_tokens_user_id ON login_tokens(user_id);
CREATE INDEX idx_login_tokens_token ON login_tokens(token);
CREATE INDEX idx_login_tokens_public_id ON login_tokens(public_id);

-- ========================================
-- OTP TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS digi_otp (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20),
    otp VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL,  -- signup, forgot_password
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,  -- 3 minutes from created_at
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_digi_otp_email ON digi_otp(email);
CREATE INDEX idx_digi_otp_created_at ON digi_otp(created_at);

-- ========================================
-- GLOBAL INVOICE NUMBER SEQUENCE
-- ========================================
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START WITH 1000000000;

-- ========================================
-- MASTER INVOICE TABLE (for quick lookups)
-- ========================================
CREATE TABLE IF NOT EXISTS invoices_master (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL,  -- income, expense
    status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, declined, clear
    bill_from_public_id VARCHAR(20) NOT NULL,
    bill_to_public_id VARCHAR(20) NOT NULL,
    bill_from_status VARCHAR(20) DEFAULT 'waiting',
    bill_to_status VARCHAR(20) DEFAULT 'pending',
    invoice_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_from_public_id) REFERENCES user_main(public_id),
    FOREIGN KEY (bill_to_public_id) REFERENCES user_main(public_id)
);

CREATE INDEX idx_invoices_master_bill_from ON invoices_master(bill_from_public_id);
CREATE INDEX idx_invoices_master_bill_to ON invoices_master(bill_to_public_id);
CREATE INDEX idx_invoices_master_invoice_number ON invoices_master(invoice_number);

-- ========================================
-- INVOICE ITEMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices_master(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    sku VARCHAR(100)
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ========================================
-- GLOBAL INVENTORY TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_master (
    id SERIAL PRIMARY KEY,
    inventory_id VARCHAR(50) UNIQUE NOT NULL,
    owner_public_id VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(15, 2) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    images TEXT[],  -- Array of image URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_public_id) REFERENCES user_main(public_id)
);

CREATE INDEX idx_inventory_master_owner ON inventory_master(owner_public_id);
CREATE INDEX idx_inventory_master_sku ON inventory_master(sku);

-- ========================================
-- RELATIONSHIP REQUESTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS relationship_requests (
    id SERIAL PRIMARY KEY,
    requester_public_id VARCHAR(20) NOT NULL,
    requested_public_id VARCHAR(20) NOT NULL,
    relationship_type VARCHAR(20) NOT NULL,  -- supplier, consumer
    status VARCHAR(20) DEFAULT 'pending',  -- pending, accepted, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_public_id) REFERENCES user_main(public_id),
    FOREIGN KEY (requested_public_id) REFERENCES user_main(public_id),
    UNIQUE(requester_public_id, requested_public_id, relationship_type)
);

CREATE INDEX idx_relationship_requests_requester ON relationship_requests(requester_public_id);
CREATE INDEX idx_relationship_requests_requested ON relationship_requests(requested_public_id);

-- ========================================
-- SUPPLIER RELATIONSHIPS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS supplier_relationships (
    id SERIAL PRIMARY KEY,
    owner_public_id VARCHAR(20) NOT NULL,
    supplier_public_id VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(20),
    location TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_public_id) REFERENCES user_main(public_id),
    FOREIGN KEY (supplier_public_id) REFERENCES user_main(public_id),
    UNIQUE(owner_public_id, supplier_public_id)
);

CREATE INDEX idx_supplier_relationships_owner ON supplier_relationships(owner_public_id);
CREATE INDEX idx_supplier_relationships_supplier ON supplier_relationships(supplier_public_id);

-- ========================================
-- CONSUMER RELATIONSHIPS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS consumer_relationships (
    id SERIAL PRIMARY KEY,
    owner_public_id VARCHAR(20) NOT NULL,
    consumer_public_id VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone_no VARCHAR(20),
    location TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_public_id) REFERENCES user_main(public_id),
    FOREIGN KEY (consumer_public_id) REFERENCES user_main(public_id),
    UNIQUE(owner_public_id, consumer_public_id)
);

CREATE INDEX idx_consumer_relationships_owner ON consumer_relationships(owner_public_id);
CREATE INDEX idx_consumer_relationships_consumer ON consumer_relationships(consumer_public_id);

-- ========================================
-- ACTIVITY LOG TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_public_id VARCHAR(20) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,  -- invoice_created, invoice_approved, inventory_added, etc.
    description TEXT NOT NULL,
    metadata JSONB,  -- Store additional data as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_public_id) REFERENCES user_main(public_id)
);

CREATE INDEX idx_activity_log_user ON activity_log(user_public_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- ========================================
-- TRIGGER TO UPDATE updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_user_main_updated_at BEFORE UPDATE ON user_main FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_master_updated_at BEFORE UPDATE ON invoices_master FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_master_updated_at BEFORE UPDATE ON inventory_master FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_relationships_updated_at BEFORE UPDATE ON supplier_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consumer_relationships_updated_at BEFORE UPDATE ON consumer_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA (Optional - for testing)
-- ========================================
-- INSERT INTO user_main (public_id, private_id, company_name, contact_person, email, phone_no, address, gender, type_of_business, role, password, is_verified)
-- VALUES ('digi-001', 'A1B2C3D4E5F6G7H', 'DigiFund Corp', 'John Doe', 'john@digifund.com', '+1234567890', '123 Business St', 'male', 'Technology', 'business_owner', '$2b$10$hashedpassword', true);
