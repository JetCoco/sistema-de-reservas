# Sistema de Reservas

Este es un sistema de reservas web desarrollado para estudios de pilates como **ALEA** o **Zen**. Permite a los usuarios visualizar clases disponibles y realizar reservas en tiempo real.

## ✨ Funcionalidades principales

- Consulta de clases disponibles desde un backend en AWS.
- Reservas en línea con validación de capacidad.
- Personalización visual por cliente mediante archivos de configuración.
- Despliegue estático en Amazon S3 con backend serverless en AWS Lambda y API Gateway.
- Soporte para múltiples estudios (clientes).

## 🧱 Tecnologías usadas

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** AWS Lambda (Python)
- **Base de datos:** DynamoDB
- **Infraestructura:** API Gateway, S3

## 🚀 Despliegue actual

Frontend:  
[https://alea-pilates-frontend.s3.us-east-1.amazonaws.com/index.html?client=alea](https://alea-pilates-frontend.s3.us-east-1.amazonaws.com/index.html?client=alea)

API:  
[https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod](https://4msxrs5scg.execute-api.us-east-1.amazonaws.com/prod)

## 📁 Estructura del proyecto

sistema-de-reservas/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── assets/            
│   └── configs/
│       ├── alea.json
│       └── zen.json
├── backend/
│   ├── lambda/
│   │   ├── GetClasses/
│   │   │   └── index.py
│   │   └── ReserveClass/
│   │       └── index.py
│   └── api_gateway/
│       └── openapi.yaml    
├── infrastructure/
│   ├── templates/          
│   └── README.md           
├── scripts/
│   └── deploy.sh           
├── README.md
└── .gitignore