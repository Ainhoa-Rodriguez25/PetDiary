# CarePet 🐾

Sistema de gestión de mascotas para hogares compartidos.

**Trabajo Final de Grado — Ingeniería Informática**  
**Universidad de Alicante — 2026**  
**Autora:** Ainhoa Rodriguez Gonzalez

---

## Descripción

CarePet es una aplicación web Progressive Web App (PWA) que permite a los miembros de un hogar coordinar y registrar todas las actividades relacionadas con el cuidado de sus mascotas: medicación, alimentación, paseos y seguimiento de salud.

### Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Spring Boot 4 + Spring Security + JWT |
| Base de datos | MySQL 8 |
| Despliegue | Docker + Docker Compose + Nginx |

---

## Requisitos previos

Solo necesitas tener instalado **Docker Desktop**:
- [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Instalación y arranque

### 1. Clonar el repositorio

```bash
git clone https://github.com/ainhoa/carepet.git
cd CarePet
```

### 2. Arrancar la aplicación

```bash
docker-compose up --build
```

La primera vez puede tardar entre 3 y 5 minutos.

### 3. Acceder a la aplicación

http://localhost

### 4. Detener la aplicación

```bash
docker-compose down
```

---

## Usuarios de prueba

| Nombre | Email | Contraseña |
|--------|-------|------------|
| Ainhoa | ainhoa@gmail.com | 123456     |

---

## Estructura del proyecto

```
CarePet/
├── backend/              # API REST — Spring Boot
│   ├── src/
│   └── Dockerfile
├── frontend/             # SPA — React + Vite
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── database/
│   └── carepet.sql       # Script SQL con estructura y datos de prueba
├── docker-compose.yml
└── README.md
```
---

## Puertos utilizados

| Servicio | Puerto |
|----------|--------|
| Frontend (Nginx) | 80 |
| Backend (Spring Boot) | 8080 |
| MySQL | 3307 |

---

## Solución de problemas

**El frontend no carga:** Espera unos segundos a que el backend termine de arrancar.

**Error de conexión a la base de datos:** Ejecuta:
```bash
docker-compose restart backend
```

**Puerto 80 en uso:** Cambia el puerto en `docker-compose.yml`:
```yaml
ports:
  - "3000:80"
```