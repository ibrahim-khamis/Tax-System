# Tax Management System - Deployment Ready

This folder contains the core files needed to deploy the Tax Management System.

## Backend Structure
- `TaxPayApp/` - Django application with models, views, serializers, URLs
- `TaxPayProject/` - Django project settings and configuration
- `manage.py` - Django management script
- `requirements.txt` - Python dependencies

## Frontend Structure
- `frontend/` - React application built with Vite
  - `src/` - Source code including components, pages, layouts
  - `package.json` - Node.js dependencies
  - `vite.config.js` - Vite configuration
  - `index.html` - Entry HTML file

## Setup Instructions

### Backend
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

3. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

4. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Features
- Admin dashboard with Material 3 theme
- Customer profile and payment management
- Role-based access control (RBAC)
- RESTful API with Django REST Framework
- Modern React frontend with Material-UI

## Default Configuration
- Backend runs on: http://127.0.0.1:8000
- Frontend runs on: http://localhost:5173 (or next available port)
- Database: SQLite (development)
