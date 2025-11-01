# 💰 Financial Monitoring System

## 📖 Overview
The **Financial Monitoring System** is a web-based application built using **Flask** and **Firebase Firestore** that helps users track, manage, and analyze their financial transactions.  
It provides a secure dashboard to record daily income and expenses, visualize spending trends, and generate reports for better financial decisions.

This project is designed to demonstrate cloud-based data management and real-time analytics integration using Firebase.

---

## ⚙️ Features
- 💵 **Add, Edit & Delete Transactions** – Record income and expenses easily.  
- 📊 **Real-Time Dashboard** – View categorized summaries and trends instantly.  
- 📈 **Expense Visualization** – Graphical insights into monthly spending patterns.  
- 🔐 **User Authentication** – Secure session-based login for users or admins.  
- ☁️ **Cloud Storage (Firebase)** – Real-time database updates using Firestore.  
- 📤 **Data Export** – Option to export transactions for report generation.  

---

## 🧰 Tech Stack
- **Frontend:** HTML, CSS, Bootstrap, Jinja Templates  
- **Backend:** Flask (Python)  
- **Database:** Firebase Firestore  
- **Authentication:** Flask Sessions  
- **Cloud Platform:** Google Firebase  

---

## 🗂️ Folder Structure<br>
FinancialMonitoringSystem/<br>
│<br>
├── static/ # CSS, JS, and images<br>
├── templates/ # HTML templates (login.html, dashboard.html, etc.)<br>
├── app.py # Main Flask application<br>
├── serviceAccountKey.json # Firebase credentials (NOT included in repo)<br>
└── requirements.txt # Python dependencies<br>
