DROP DATABASE IF EXISTS smartclean;
SHOW DATABASES;
CREATE DATABASE smartclean;
USE smartclean;
SELECT DATABASE();
CREATE TABLE citizens (
    citizen_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    ward_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE complaints (
    complaint_id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id INT NOT NULL,
    issue_type VARCHAR(100) NOT NULL,
    ward_number INT NOT NULL,
    street_number VARCHAR(50),
    description TEXT,
    photo_path VARCHAR(255),
    complaint_date DATE DEFAULT (CURRENT_DATE),
    status VARCHAR(30) DEFAULT 'Pending',

    FOREIGN KEY (citizen_id) REFERENCES citizens(citizen_id)
);
CREATE TABLE garbage_collections (
    collection_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    collector_name VARCHAR(100),
    collection_date DATE,
    collection_status VARCHAR(30) DEFAULT 'Pending',
    remarks TEXT,

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
);
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE issue_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE workers (
    worker_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    status VARCHAR(30) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE complaint_assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    worker_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignment_status VARCHAR(30) DEFAULT 'Assigned',

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id)
);
CREATE TABLE complaint_updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    updated_by INT,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    update_description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id),
    FOREIGN KEY (updated_by) REFERENCES admins(admin_id)
);
show tables;
INSERT INTO issue_categories (category_name, description)
VALUES
('Overflowing Bins', 'Bins that are full or overflowing with waste'),
('Uncollected Waste', 'Waste that has not been collected on time'),
('Damaged Bin', 'Bins that are broken or damaged'),
('Illegal Dumping', 'Waste dumped in unauthorized locations'),
('Others', 'Other garbage-related issues not covered above');
SELECT * FROM issue_categories;
INSERT INTO citizens
(name, phone, email, password, address, ward_number)
VALUES
('Rahul Kumar', '9876543210', 'rahul@gmail.com', 'Rahul@123', 'MG Road', 1),
('Priya Sharma', '9876543211', 'priya@gmail.com', 'Priya@123', 'Gandhi Nagar', 2),
('Arun Kumar', '9876543212', 'arun@gmail.com', 'Arun@123', 'Station Road', 3),
('Sneha Reddy', '9876543213', 'sneha@gmail.com', 'Sneha@123', 'Lake View Road', 4),
('Kiran Rao', '9876543214', 'kiran@gmail.com', 'Kiran@123', 'Market Street', 5),
('Aditya Verma', '9876543215', 'aditya@gmail.com', 'Aditya@123', 'Temple Road', 1),
('Anjali Singh', '9876543216', 'anjali@gmail.com', 'Anjali@123', 'Green Park', 2),
('Rohit Patel', '9876543217', 'rohit@gmail.com', 'Rohit@123', 'Main Road', 3),
('Neha Gupta', '9876543218', 'neha@gmail.com', 'Neha@123', 'Ashok Nagar', 4),
('Vikram Das', '9876543219', 'vikram@gmail.com', 'Vikram@123', 'Church Street', 5),
('Pooja Nair', '9876543220', 'pooja@gmail.com', 'Pooja@123', 'Nehru Road', 1),
('Akash Mehta', '9876543221', 'akash@gmail.com', 'Akash@123', 'College Road', 2),
('Kavya Iyer', '9876543222', 'kavya@gmail.com', 'Kavya@123', 'Park Street', 3),
('Suresh Yadav', '9876543223', 'suresh@gmail.com', 'Suresh@123', 'Ring Road', 4),
('Divya Menon', '9876543224', 'divya@gmail.com', 'Divya@123', 'Garden Road', 5);
SELECT * FROM citizens;

INSERT INTO workers (name, phone, email, address, status)
VALUES
('Ramesh Kumar', '9876500001', 'ramesh@gmail.com', 'MG Road', 'Available'),
('Suresh Reddy', '9876500002', 'suresh@gmail.com', 'Gandhi Nagar', 'Available'),
('Mahesh Rao', '9876500003', 'mahesh@gmail.com', 'Station Road', 'Available'),
('Anil Kumar', '9876500004', 'anil@gmail.com', 'Market Street', 'Available'),
('Rajesh Singh', '9876500005', 'rajesh@gmail.com', 'Temple Road', 'Available'),
('Vijay Sharma', '9876500006', 'vijay@gmail.com', 'Green Park', 'Available'),
('Karthik Reddy', '9876500007', 'karthik@gmail.com', 'Lake View Road', 'Available'),
('Naveen Kumar', '9876500008', 'naveen@gmail.com', 'Ashok Nagar', 'Available'),
('Prakash Rao', '9876500009', 'prakash@gmail.com', 'Church Street', 'Available'),
('Arjun Patel', '9876500010', 'arjun@gmail.com', 'College Road', 'Available'),
('Manoj Yadav', '9876500011', 'manoj@gmail.com', 'Ring Road', 'Available'),
('Ravi Teja', '9876500012', 'raviteja@gmail.com', 'Park Street', 'Available'),
('Deepak Verma', '9876500013', 'deepak@gmail.com', 'Hospital Road', 'Available'),
('Sunil Das', '9876500014', 'sunil@gmail.com', 'Railway Road', 'Available'),
('Harish Naidu', '9876500015', 'harish@gmail.com', 'Indira Nagar', 'Available');
SELECT * FROM workers;

INSERT INTO complaints
(citizen_id, issue_type, ward_number, street_number, description, photo_path, status)
VALUES
(1, 'Overflowing Bins', 1, 'MG Road',
 'The dustbin is completely full and garbage is overflowing onto the road.',
 'uploads/bin1.jpg', 'Pending'),

(2, 'Damaged Bin', 2, 'Gandhi Nagar',
 'The public dustbin is broken and cannot be used properly.',
 'uploads/bin2.jpg', 'Pending'),

(3, 'Uncollected Waste', 3, 'Station Road',
 'Garbage has not been collected from this street for several days.',
 'uploads/waste1.jpg', 'Pending'),

(4, 'Illegal Dumping', 4, 'Lake View Road',
 'Waste is being dumped illegally near the roadside.',
 'uploads/dumping1.jpg', 'Pending'),

(5, 'Others', 5, 'Market Street',
 'Garbage-related issue reported in the local area.',
 'uploads/other1.jpg', 'Pending'),

(6, 'Overflowing Bins', 1, 'Temple Road',
 'The dustbin is overflowing and waste is scattered around it.',
 'uploads/bin3.jpg', 'Pending'),

(7, 'Damaged Bin', 2, 'Green Park',
 'The garbage bin is damaged and needs to be replaced.',
 'uploads/bin4.jpg', 'Pending'),

(8, 'Uncollected Waste', 3, 'Ashok Nagar',
 'Collected waste has not been removed from the street on time.',
 'uploads/waste2.jpg', 'Pending'),

(9, 'Illegal Dumping', 4, 'Church Street',
 'Garbage has been dumped at an unauthorized location.',
 'uploads/dumping2.jpg', 'Pending'),

(10, 'Others', 5, 'College Road',
 'Other garbage-related problem reported by the citizen.',
 'uploads/other2.jpg', 'Pending'),

(11, 'Overflowing Bins', 1, 'Ring Road',
 'The dustbin is full and garbage is spilling onto the road.',
 'uploads/bin5.jpg', 'Pending'),

(12, 'Damaged Bin', 2, 'Park Street',
 'The public bin is broken and requires repair or replacement.',
 'uploads/bin6.jpg', 'Pending'),

(13, 'Uncollected Waste', 3, 'Hospital Road',
 'Garbage has not been collected according to the schedule.',
 'uploads/waste3.jpg', 'Pending'),

(14, 'Illegal Dumping', 4, 'Railway Road',
 'Waste has been illegally dumped beside the road.',
 'uploads/dumping3.jpg', 'Pending'),

(15, 'Others', 5, 'Indira Nagar',
 'A different garbage-related issue has been reported.',
 'uploads/other3.jpg', 'Pending');

SELECT * FROM complaints;

INSERT INTO complaint_assignments
(complaint_id, worker_id, assignment_status)
VALUES
(1, 1, 'Assigned'),
(2, 2, 'Assigned'),
(3, 3, 'Assigned'),
(4, 4, 'Assigned'),
(5, 5, 'Assigned'),
(6, 6, 'Assigned'),
(7, 7, 'Assigned'),
(8, 8, 'Assigned'),
(9, 9, 'Assigned'),
(10, 10, 'Assigned'),
(11, 11, 'Assigned'),
(12, 12, 'Assigned'),
(13, 13, 'Assigned'),
(14, 14, 'Assigned'),
(15, 15, 'Assigned');

SELECT * FROM complaint_assignments;

INSERT INTO admins
(name, email, password, phone)
VALUES
('Admin One', 'admin1@smartclean.com', 'Admin@123', '9876510001'),
('Admin Two', 'admin2@smartclean.com', 'Admin@456', '9876510002');

SELECT * FROM admins;

INSERT INTO complaint_updates
(complaint_id, updated_by, old_status, new_status, update_description)
VALUES
(1, 1, 'Pending', 'In Progress', 'Complaint has been assigned to a worker and work has started.'),
(2, 2, 'Pending', 'In Progress', 'Damaged bin complaint is being inspected by the assigned worker.'),
(3, 1, 'Pending', 'In Progress', 'Uncollected waste complaint has been forwarded to the collection team.'),
(4, 2, 'Pending', 'In Progress', 'Illegal dumping complaint is being investigated.'),
(5, 1, 'Pending', 'Resolved', 'Garbage-related issue has been checked and resolved.'),
(6, 2, 'Pending', 'In Progress', 'Overflowing bin complaint is being handled by the assigned worker.'),
(7, 1, 'Pending', 'Resolved', 'Damaged bin has been repaired or replaced.'),
(8, 2, 'Pending', 'In Progress', 'Waste collection issue is currently being handled.'),
(9, 1, 'Pending', 'In Progress', 'Illegal dumping location has been inspected.'),
(10, 2, 'Pending', 'Resolved', 'The reported garbage-related issue has been resolved.'),
(11, 1, 'Pending', 'In Progress', 'Overflowing bin is scheduled for cleaning and collection.'),
(12, 2, 'Pending', 'Resolved', 'Damaged bin complaint has been resolved.'),
(13, 1, 'Pending', 'In Progress', 'Uncollected waste complaint is being processed.'),
(14, 2, 'Pending', 'In Progress', 'Illegal dumping complaint is under review.'),
(15, 1, 'Pending', 'Resolved', 'The reported issue has been inspected and resolved.');

SELECT * FROM complaint_updates;
























