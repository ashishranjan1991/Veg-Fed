
-- Bihar State Vegetable Processing & Marketing Co-operative Federation Ltd.
-- Database: veg_erp_db

CREATE DATABASE IF NOT EXISTS veg_erp_db;
USE veg_erp_db;

-- 1. Users & Roles
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role ENUM('ADMIN', 'PVCS_USER', 'UNION_USER', 'DEPT_OFFICIAL', 'FARMER') NOT NULL,
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vendors (Buyers/Institutional Partners)
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150),
    mobile VARCHAR(15) NOT NULL,
    vendor_type ENUM('Wholesaler', 'Retailer', 'Exporter', 'Institutional') NOT NULL,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Farmers Registration
CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(50) PRIMARY KEY,
    dbt_number VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    aadhaar_masked VARCHAR(12),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20),
    status ENUM('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Deactivated') DEFAULT 'Submitted',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Land Plots & Geo-Tagging
CREATE TABLE IF NOT EXISTS land_plots (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50),
    khata_number VARCHAR(50),
    khesra_number VARCHAR(50),
    area_acres DECIMAL(10,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    soil_type VARCHAR(100),
    irrigation_source VARCHAR(100),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- 5. Centralised Daily Prices (Master Data)
CREATE TABLE IF NOT EXISTS daily_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vegetable VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 6. Procurement Transactions
CREATE TABLE IF NOT EXISTS procurement (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50) NOT NULL,
    vendor_id VARCHAR(50), -- Nullable if direct procurement
    vegetable VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    grade ENUM('A', 'B', 'C', 'D') NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sync_status ENUM('Pending', 'Synced', 'Failed') DEFAULT 'Synced',
    FOREIGN KEY (farmer_id) REFERENCES farmers(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- 7. Schemes & Subsidies
CREATE TABLE IF NOT EXISTS schemes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    total_budget DECIMAL(20,2),
    utilized_budget DECIMAL(20,2) DEFAULT 0,
    status ENUM('Active', 'Planned', 'Closed') DEFAULT 'Active'
);

-- 8. Feedback & Support Tickets
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    category ENUM('Technical', 'Pricing', 'Membership', 'Scheme', 'Other') DEFAULT 'Other',
    message TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(50),
    FOREIGN KEY (resolved_by) REFERENCES users(id)
);

-- SEED DATA FOR DEMO
INSERT INTO vendors (id, name, contact_person, mobile, vendor_type, location) VALUES
('VEN-001', 'Bihar Fresh Mart', 'Arun Jha', '9988776655', 'Wholesaler', 'Patna'),
('VEN-002', 'Metro Institutional', 'Sita Ram', '8877665544', 'Institutional', 'Gaya');

INSERT INTO daily_prices (vegetable, base_price, updated_by) VALUES
('Tomato', 26.50, 'ADM001'),
('Potato', 15.20, 'ADM001'),
('Onion', 34.00, 'ADM001'),
('Brinjal', 21.00, 'ADM001');

INSERT INTO schemes (id, name, code, total_budget, utilized_budget, status) VALUES
('S001', 'Infrastructure Development', 'VEGFED-INF-25', 11430000.00, 4500000.00, 'Active'),
('S002', 'Outlet Program', 'VEGFED-OUT-25', 744000.00, 120000.00, 'Active');

INSERT INTO feedback (name, mobile, category, message, status) VALUES
('Ram Prakash', '9800011122', 'Pricing', 'Tomato prices in Danapur PVCS are not matching the daily master rate.', 'Open'),
('Sita Devi', '9700033344', 'Technical', 'Unable to upload land records photo from mobile app.', 'Open');
