# Deployment Guide: Bihar Vegetable ERP on AWS

This guide outlines the professional deployment of the Bihar Vegetable ERP onto a robust AWS environment using **Amazon EC2** for the application server and **Amazon RDS** for the managed MySQL database.

---

## Phase 1: Database Infrastructure (Amazon RDS)

Before launching the application server, you must set up the persistent data layer.

1.  **Create RDS Instance**:
    *   Navigate to the **RDS Console** > **Create Database**.
    *   **Engine**: MySQL 8.0.
    *   **Template**: `Free Tier` (for testing) or `Production`.
    *   **Settings**: Set a Master Username (e.g., `vegfed_admin`) and a strong Master Password.
    *   **Connectivity**: Set **Public Access** to **No** (best security practice). 
2.  **Configure Database Security Group**:
    *   In the RDS instance details, click the **VPC Security Group**.
    *   Add an **Inbound Rule**: Type `MYSQL/Aurora` (Port 3306), Source: Select the Security Group of your EC2 instance (to be created in Phase 2).
3.  **Initialize Schema**:
    *   Connect to the database using a tool like MySQL Workbench or DBeaver using the RDS Endpoint.
    *   Execute the contents of the `veg.sql` file provided in the project root to create the tables (`farmers`, `procurement`, `schemes`, etc.).

---

## Phase 2: Application Server (Amazon EC2)

1.  **Launch Instance**:
    *   **AMI**: Ubuntu Server 24.04 LTS.
    *   **Instance Type**: `t3.small` (recommended for ERP logic) or `t2.micro`.
    *   **Key Pair**: Create and download a `.pem` key.
    *   **Security Group**: Allow **SSH (22)**, **HTTP (80)**, and **HTTPS (443)**.
2.  **Server Preparation**:
    Connect via SSH: `ssh -i your-key.pem ubuntu@your-ec2-ip`
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y nginx git
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

---

## Phase 3: Application Build and Deployment

The application is a high-performance React frontend. We will build it and serve the static assets via Nginx.

1.  **Clone and Build**:
    ```bash
    git clone <your-repository-url>
    cd bihar-vegetable-erp
    npm install
    # Set the Gemini API Key as an environment variable for the build
    export API_KEY="your-google-gemini-api-key"
    npm run build
    ```
2.  **Configure Nginx**:
    Create a configuration file: `sudo nano /etc/nginx/sites-available/veg-erp`
    ```nginx
    server {
        listen 80;
        server_name your-domain-or-ip;

        location / {
            root /home/ubuntu/bihar-vegetable-erp/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }
    ```
    Enable the site and restart Nginx:
    ```bash
    sudo ln -s /etc/nginx/sites-available/veg-erp /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```

---

## Phase 4: Production Best Practices

1.  **Environment Variables**: Ensure your `API_KEY` for the Advisory module is managed securely. On EC2, you can use a `.env` file or AWS Secrets Manager.
2.  **SSL/TLS**: Install Certbot for free SSL:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```
3.  **MySQL Connectivity**: 
    *   The "Sync to MySQL" button in the **Master Data Module** requires a backend API. To make this operational, deploy a small Node.js/Express server on the same EC2 instance using **PM2** to handle RDS communication.
    *   Update the `host` in your backend connection string to the **RDS Endpoint** provided in the AWS Console.

### Deployment Summary
*   **Tier 1 (Client)**: User browser interacting with the React UI.
*   **Tier 2 (Logic)**: Nginx/Node.js on EC2 processing business rules and Gemini AI calls.
*   **Tier 3 (Data)**: Amazon RDS MySQL storing official state records.