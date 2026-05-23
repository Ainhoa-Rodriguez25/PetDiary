# 🐾 CarePet - Sistema de Gestión de Mascotas

Sistema completo para la gestión y cuidado de mascotas con soporte multi-usuario, control de medicación, alimentación y actividades.

---

## 📊 Características Principales

### ✅ **Sistema Multi-Usuario (Hogares)**
- Creación y gestión de hogares compartidos
- Sistema de invitaciones por email
- Roles y permisos (OWNER, ADMIN, MEMBER)
- Colaboración entre múltiples usuarios

### ✅ **Gestión de Mascotas**
- Registro completo de mascotas
- Información médica y alergias
- Asociación a hogares compartidos
- Catálogo de razas por especie

### ✅ **Control de Medicación**
- Registro de tratamientos
- Frecuencias personalizadas (cada 8h, 12h, 24h, etc.)
- Fechas de inicio y fin
- Validación anti-duplicados

### ✅ **Control de Alimentación**
- Rutinas de comidas personalizadas
- Registro de comidas dadas (logs)
- Horarios y porciones
- Historial completo

### ✅ **Registro de Paseos**
- Tracking de actividad física
- Duración y distancia
- Notas y observaciones

### ✅ **Seguridad**
- Autenticación JWT
- Tokens con expiración
- Protección de endpoints
- Validación de permisos por rol

---

## 🛠️ Tecnologías Utilizadas

### **Backend:**
- **Java 17**
- **Spring Boot 3.2.3**
- **Spring Security 6** (JWT)
- **Spring Data JPA**
- **MySQL 8**
- **Lombok**
- **Maven**

### **Dependencias principales:**
- `spring-boot-starter-web`
- `spring-boot-starter-security`
- `spring-boot-starter-data-jpa`
- `mysql-connector-j`
- `jjwt` (JSON Web Tokens)
- `lombok`
- `spring-boot-starter-validation`

---

## 📦 Instalación y Configuración

### **1. Requisitos Previos:**
- Java 17 o superior
- Maven 3.8+
- MySQL 8.0+
- Git

### **2. Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/carepet-backend.git
cd carepet-backend
```

### **3. Configurar Base de Datos:**

Crear base de datos en MySQL:
```sql
CREATE DATABASE carepet;
```

### **4. Configurar application.properties:**

Ubicación: `src/main/resources/application.properties`

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/carepet
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=tu_clave_secreta_muy_larga_y_segura_minimo_256_bits
jwt.expiration=604800000
```

### **5. Compilar y ejecutar:**
```bash
# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

---

## 📡 API Endpoints

### **Autenticación (Público)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### **Hogares (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/households` | Crear hogar |
| GET | `/api/households?userId={id}` | Listar hogares del usuario |
| GET | `/api/households/{id}` | Ver hogar específico |
| PUT | `/api/households/{id}` | Actualizar hogar (OWNER) |
| DELETE | `/api/households/{id}` | Eliminar hogar (OWNER) |
| GET | `/api/households/{id}/members` | Ver miembros del hogar |

### **Invitaciones (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/households/{id}/invite` | Invitar usuario (OWNER/ADMIN) |
| GET | `/api/households/invitations/pending?email={email}` | Ver invitaciones pendientes |
| POST | `/api/households/invitations/{id}/accept` | Aceptar/rechazar invitación |
| GET | `/api/households/{id}/invitations` | Ver invitaciones del hogar |

### **Mascotas (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/pets` | Crear mascota |
| GET | `/api/pets?householdId={id}` | Listar mascotas del hogar |
| GET | `/api/pets/{id}` | Ver mascota |
| PUT | `/api/pets/{id}` | Actualizar mascota |
| DELETE | `/api/pets/{id}` | Eliminar mascota |

### **Medicación (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/medications` | Registrar medicación |
| GET | `/api/medications?petId={id}` | Listar medicación de mascota |
| GET | `/api/medications/{id}` | Ver medicación |
| PUT | `/api/medications/{id}` | Actualizar medicación |
| DELETE | `/api/medications/{id}` | Eliminar medicación |

### **Comidas (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/meals` | Crear rutina de comidas |
| GET | `/api/meals?petId={id}` | Listar rutinas |
| POST | `/api/meals/{id}/log` | Registrar comida dada |
| GET | `/api/meals/{id}/history` | Ver historial |

### **Paseos (Requiere JWT)**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/walks` | Registrar paseo |
| GET | `/api/walks?petId={id}` | Listar paseos |
| GET | `/api/walks/{id}` | Ver paseo |
| PUT | `/api/walks/{id}` | Actualizar paseo |
| DELETE | `/api/walks/{id}` | Eliminar paseo |

---

## 🔐 Autenticación JWT

### **1. Registro:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@mail.com"
}
```

### **2. Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@mail.com",
  "password": "password123"
}
```

### **3. Usar token en peticiones protegidas:**
```http
GET /api/households?userId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

---

## 🗄️ Modelo de Base de Datos

### **Tablas principales:**
- `users` - Usuarios del sistema
- `households` - Hogares compartidos
- `household_members` - Relación usuarios-hogares (N:N)
- `household_invitations` - Invitaciones pendientes
- `pets` - Mascotas
- `breeds` - Catálogo de razas
- `medications` - Tratamientos médicos
- `meals` - Rutinas de alimentación
- `meal_logs` - Registro de comidas dadas
- `walks` - Registro de paseos

### **Relaciones clave:**
- Usuario → Hogares (N:N a través de household_members)
- Hogar → Mascotas (1:N)
- Mascota → Medicación/Comidas/Paseos (1:N)

---

## 👥 Sistema de Roles

### **OWNER (Propietario)**
- Control total del hogar
- Único que puede eliminar el hogar
- Puede cambiar roles de otros miembros
- Puede invitar y expulsar miembros

### **ADMIN (Administrador)**
- Puede invitar nuevos miembros
- Puede expulsar miembros (excepto OWNER)
- Puede gestionar mascotas y actividades
- No puede eliminar el hogar ni cambiar roles

### **MEMBER (Miembro)**
- Puede ver y gestionar mascotas del hogar
- Puede registrar actividades (medicación, comidas, paseos)
- No puede invitar, expulsar ni cambiar roles
- Puede salir del hogar voluntariamente

---

## 🧪 Testing

El proyecto ha sido probado exhaustivamente:

- ✅ Registro e inicio de sesión
- ✅ Creación y gestión de hogares
- ✅ Sistema de invitaciones
- ✅ Gestión de mascotas
- ✅ Control de medicación
- ✅ Registro de alimentación
- ✅ Registro de paseos
- ✅ Validación de roles y permisos
- ✅ Seguridad JWT (con y sin token)

---

## 📝 Notas de Desarrollo

### **Decisiones técnicas:**

1. **JWT vs Sesiones:** Se eligió JWT para API stateless y escalabilidad
2. **Multi-usuario:** Sistema de hogares para compartir mascotas entre familias
3. **Validación anti-duplicados:** Previene registros duplicados de medicación/comidas
4. **ENUM vs VARCHAR:** Se usa VARCHAR para mayor flexibilidad

### **Próximas mejoras:**
- [ ] Frontend React/Angular/Vue
- [ ] Notificaciones push
- [ ] Recordatorios automáticos de medicación
- [ ] Gráficas de actividad
- [ ] Exportación de datos (PDF)
- [ ] Imágenes de mascotas

---

## 👨‍💻 Autor

**Ainhoa Rodríguez**  
Trabajo Final de Grado - Ingeniería Informática  
Universidad de Elche  
2026

---

## 📄 Licencia

Este proyecto es un Trabajo Final de Grado (TFG) desarrollado con fines educativos.

---

## 🙏 Agradecimientos

- Universidad de Elche
- Tutores del TFG
- Comunidad de Spring Boot

---

## 📞 Contacto

- GitHub: [@Ainhoa-Rodriguez25](https://github.com/Ainhoa-Rodriguez25)
- LinkedIn: [Ainhoa Rodriguez](https://www.linkedin.com/in/ainhoa-r-964178125/)