
-- Create OmegaDB database
CREATE DATABASE IF NOT EXISTS OmegaDB;
USE OmegaDB;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Bill_Items;
DROP TABLE IF EXISTS Billing;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS User;

-- Create User table with email and address fields
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255)
);

-- Insert sample users with unique addresses around NS Palayam, Coimbatore
INSERT INTO User (username, phone, email, address) VALUES
('Arun Kumar', '9876543210', 'arun.kumar@example.com', '12, NS Palayam Main Road, Coimbatore - 641035'),
('Priya Dharshini', '8765432109', 'priya.d@example.com', '45, Gandhi Nagar, NS Palayam, Coimbatore - 641035'),
('Sathish Kumar', '7654321098', 'sathish.k@example.com', '78, VOC Street, NS Palayam, Coimbatore - 641035'),
('Divya Lakshmi', '6543210987', 'divya.l@example.com', '32, Bharathi Nagar, NS Palayam, Coimbatore - 641035'),
('Karthik Raja', '9432109876', 'karthik.r@example.com', '90, KVR Layout, NS Palayam, Coimbatore - 641035'),
('Meena Kumari', '8321098765', 'meena.k@example.com', '21, Indira Nagar, NS Palayam, Coimbatore - 641035'),
('Vigneshwaran', '7210987654', 'vignesh.v@example.com', '11, Raja Garden, NS Palayam, Coimbatore - 641035'),
('Lakshmi Narayan', '6109876543', 'lakshmi.n@example.com', '3A, SNR Street, NS Palayam, Coimbatore - 641035');

-- Create Product table
CREATE TABLE Product (
    pid INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50),
    max_watts INT,
    basic_price DECIMAL(10, 2)
);

-- Create Billing table
CREATE TABLE Billing (
    billing_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    billing_date DATE,
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- Create Bill_Items table
CREATE TABLE Bill_Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    CONSTRAINT fk_bill_id FOREIGN KEY (bill_id) REFERENCES Billing(billing_id),
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES Product(pid)
);

-- Original Product and Bill Data
INSERT INTO Product (model, max_watts, basic_price) VALUES
('v4 1.5hp bldc pump with controler (hh)', 1200, 26500.00),
('v4 2.0hp bldc pump with controler (hh)', 1500, 30000.00),
('v6 2.0hp bldc pump with controler (hh)', 1500, 32000.00),
('v6 3.0hp bldc pump with controler (hh)', 2250, 41000.00),
('v6 5.0hp bldc pump with controler (hh)', 3750, 68500.00),
('v6 7.5hp bldc pump with controler (hh)', 5600, 88500.00),
('v6 10.0hp bldc pump with controler (hh)', 7500, 108500.00),
('v8 10.0hp bldc pump with controler (hh)', 7500, 118500.00),
('v8 15.0hp bldc pump with controler (hh)', 11250, 168500.00),
('v8 20.0hp bldc pump with controler (hh)', 15000, 208500.00),
('v8 25.0hp bldc pump with controler (hh)', 18750, 248500.00);

-- Insert Billing records
INSERT INTO Billing (user_id, billing_date, amount, payment_method, status) VALUES
(1, '2025-04-01', 53000.00, 'Credit Card', 'Paid'),         
(3, '2025-04-02', 88500.00, 'UPI', 'Paid'),                 
(5, '2025-04-03', 68500.00, 'Cash', 'Pending'),             
(7, '2025-04-04', 137000.00, 'Debit Card', 'Paid'),         
(2, '2025-04-05', 108500.00, 'Net Banking', 'Pending');     

-- Insert Bill_Items records (linked by billing_id)
INSERT INTO Bill_Items (bill_id, product_id, quantity, price) VALUES
(1, 1, 2, 26500.00),  
(2, 6, 1, 88500.00),  
(3, 5, 1, 68500.00),  
(4, 4, 2, 41000.00),  
(5, 7, 1, 108500.00);
