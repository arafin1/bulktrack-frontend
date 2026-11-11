# BulkTrack — B2B Garments Sample & Bulk Production ERP

BulkTrack is a full-stack B2B SaaS/ERP application designed for the garments manufacturing industry to track buyer inquiries, sample approvals, bill of materials (BOM), and bulk production orders.

## Cloud Architecture (AWS `ap-southeast-2`)
* **Frontend:** React + Tailwind CSS (Hosted on Vercel with edge proxy rewrites)
* **Compute:** Ubuntu Linux on AWS EC2 (`t3.micro`) running Nginx Reverse Proxy + Dockerized Ruby on Rails 7 API (with 2GB host swap configured for build stability)
* **Network Isolation:** Custom AWS VPC (`10.0.0.0/16`) separating public web traffic (`10.0.1.0/24`) from isolated private database subnets (`10.0.2.0/24`, `10.0.3.0/24`)
* **Database:** Amazon RDS for PostgreSQL deployed in private subnets (`Public Access = No`), locked down via Security Group referencing on port 5432
* **Document Storage:** Amazon S3 with Block All Public Access enabled, serving buyer tech packs and invoices via dynamic 300-second Presigned URLs

## Core Features
* **Role-Based Access Control (RBAC):** Custom JWT authentication supporting Admin, Merchandiser, Factory, and Buyer roles.
* **Sample & Bulk Order Workflows:** Tracks garment quantities across industry-standard units (`pcs`, `yds`, `kg`, `meters`).
