
-- Bihar State Vegetable Processing & Marketing Co-operative Federation Ltd.
-- Database: veg_erp_db
-- Refined for 3-Tier ERP Logic (Farmer -> PVCS -> Union)

CREATE DATABASE IF NOT EXISTS veg_erp_db;
USE veg_erp_db;

-- 1. Users & Roles (L1: Farmer, L2: PVCS, L3: Union/State)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role ENUM('ADMIN', 'PVCS_USER', 'UNION_USER', 'DEPT_OFFICIAL', 'FARMER') NOT NULL,
    organization VARCHAR(255), -- Name of PVCS Center or District Union
    district VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vendors & Institutional Buyers
CREATE TABLE IF NOT EXISTS vendors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150),
    mobile VARCHAR(15) NOT NULL,
    vendor_type ENUM('Wholesaler', 'Retailer', 'Exporter', 'Institutional') NOT NULL,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Farmers Registration (DBT Integrated)
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
    assigned_pvcs_id VARCHAR(50),
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Land Plots & Geo-Tagging (Enhanced with Maps Grounding Support)
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
    verified_by_gemini BOOLEAN DEFAULT FALSE,
    geo_insights TEXT, -- Stores Gemini Maps Grounding text output
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- 5. Centralised Daily Prices (Master Data - L3 Control)
CREATE TABLE IF NOT EXISTS daily_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vegetable VARCHAR(100) NOT NULL,
    base_price_grade_a DECIMAL(10,2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 6. Transactions (Unified Procurement and Sales)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    mode ENUM('PROCUREMENT', 'SALES') NOT NULL,
    source_type ENUM('Farmer', 'Vendor', 'Aggregator', 'Union') NOT NULL,
    entity_name VARCHAR(255) NOT NULL, -- Farmer Name or Vendor Name
    entity_id VARCHAR(50), -- Reference to farmers.id or vendors.id
    vegetable VARCHAR(100) NOT NULL,
    quantity_kg DECIMAL(10,2) NOT NULL,
    grade ENUM('A', 'B', 'C', 'D') NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    location_node VARCHAR(255), -- The PVCS center where transaction occurred
    transaction_date DATE NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Draft', 'Approved', 'Locked') DEFAULT 'Locked'
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

-- SEED DATA FOR DEMO
INSERT INTO users (id, username, password_hash, full_name, role, organization, district) VALUES
('ADM001', 'admin_state', 'hash_pw', 'State Admin', 'ADMIN', 'VEGFED HQ', 'Patna'),
('PVCS001', 'danapur_pvcs', 'hash_pw', 'Rajesh Kumar', 'PVCS_USER', 'Danapur Block PVCS', 'Patna');

INSERT INTO vendors (id, name, contact_person, mobile, vendor_type, location) VALUES
('VEN-001', 'Bihar Fresh Mart', 'Arun Jha', '9988776655', 'Wholesaler', 'Patna'),
('VEN-002', 'Metro Institutional', 'Sita Ram', '8877665544', 'Institutional', 'Gaya');

INSERT INTO daily_prices (vegetable, base_price_grade_a, updated_by) VALUES
('Tomato', 26.50, 'ADM001'),
('Potato', 15.20, 'ADM001'),
('Onion', 34.00, 'ADM001'),
('Brinjal', 21.00, 'ADM001');

INSERT INTO transactions (id, mode, source_type, entity_name, vegetable, quantity_kg, grade, price_per_unit, total_amount, location_node, transaction_date) VALUES
('PROC-101', 'PROCUREMENT', 'Farmer', 'Sunil Mahto', 'Tomato', 250.00, 'A', 26.50, 6625.00, 'Danapur PVCS', '2026-01-11'),
('SALE-102', 'SALES', 'Vendor', 'Bihar Fresh Ltd', 'Onion', 500.00, 'B', 27.20, 13600.00, 'Patna Central PVCS', '2026-01-10');
