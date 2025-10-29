# 🛡️ **KonCheck: Sistema de Consulta Ciudadano para la Fuerza Pública**

Sistema de **verificación de antecedentes** diseñado para su uso en campo por miembros de la **Policía Nacional, Ejército, Armada y Fuerza Aérea de Colombia**.  
Permite la **consulta rápida de antecedentes judiciales** mediante el escaneo del código de barras de la cédula o la entrada manual, facilitando **tomas de decisiones inmediatas**.

---

## 📋 **Tabla de Contenidos**
- [✨ Características Clave](#-características-clave)
- [🛠️ Tecnologías del Stack](#️-tecnologías-del-stack)
- [📂 Estructura de Arquitectura](#-estructura-de-arquitectura)
- [📦 Requisitos Previos](#-requisitos-previos)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🎮 Uso y Flujo de la Aplicación](#-uso-y-flujo-de-la-aplicación)
- [🌐 API Endpoints](#-api-endpoints)
- [🗄️ Modelo de Datos (Esquema SQL)](#️-modelo-de-datos-esquema-sql)
- [🤝 Contribuir](#-contribuir)

---

## ✨ **Características Clave**

- **Aplicación Nativa:** Desarrollado para Android/iOS con **React Native + Expo**.  
- **Consulta (HU9):** Escaneo del código de barras del documento para verificar antecedentes judiciales de forma rápida y confiable.  
- **Mitigación de Riesgos:** Opción de **ingreso manual** en caso de fallas en la lectura óptica.  
- **Seguridad:** Autenticación mediante **identificación y contraseña** exclusiva para personal autorizado.  
- **Auditoría:** Registro detallado de cada consulta (fecha, hora, usuario) para trazabilidad y control.  
- **Arquitectura Escalable:** Basado en **API REST** con comunicación eficiente entre frontend y backend.

---

## 🛠️ **Tecnologías del Stack**

Se utiliza un **Stack Full TypeScript** para garantizar uniformidad en todo el proyecto.

### **Frontend (Aplicación Móvil)**
- ⚛️ **React Native / Expo** — Desarrollo móvil nativo.  
- 💙 **TypeScript** — Tipado estático para un código más seguro.  
- 🌐 **Axios** — Cliente HTTP para comunicación con la API.  
- 🎨 **Diseño:** Paleta de colores  
  - Verde Oscuro: `#388E3C`  
  - Verde Claro: `#66BB6A`  

### **Backend (API REST)**
- 🟢 **Node.js / Express** — Servidor y runtime.  
- 💙 **TypeScript** — Tipado consistente en el backend.  
- 🐘 **PostgreSQL / Neon** — Base de datos relacional.  
- 🔐 **bcrypt** — Encriptación de contraseñas para mayor seguridad.  

---

## 📂 **Estructura de Arquitectura**

El proyecto se organiza como **Monorepo** bajo una arquitectura modular en capas, lo que facilita la **integración, escalabilidad y mantenimiento**.

---

## 📦 **Requisitos Previos**

Asegúrate de tener instaladas las siguientes dependencias:

| Herramienta | Versión Requerida |
|--------------|------------------|
| Node.js      | ≥ 18.x           |
| npm          | ≥ 9.x            |
| Expo CLI     | `npm install -g expo-cli` |
| Expo Go      | En dispositivo físico o emulador Android/iOS |

---

## 🚀 **Instalación y Configuración**

### 1️⃣ Clonar e Instalar Dependencias
```bash
git clone https://github.com/tu-usuario/KonCheck.git
cd KonCheck
npm install
