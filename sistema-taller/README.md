# Sistema de Taller Mecanico - Spring Boot

Proyecto educativo para gestionar un taller mecanico con Java, Spring Boot, JPA, H2, API REST y paginas HTML (Thymeleaf).

## Requisitos
- JDK 17 o superior
- IntelliJ IDEA (o Maven en la terminal)
- Maven (IntelliJ puede gestionarlo desde el pom.xml)

## Ejecutar
1. Abrir la carpeta `sistema-taller` en IntelliJ IDEA.
2. Esperar que Maven descargue las dependencias.
3. Abrir `TallerApplication.java`.
4. Pulsar el triangulo verde junto al metodo `main`.
5. Esperar el mensaje `Started TallerApplication`.
6. Abrir `http://localhost:8081` en el navegador.

Desde la terminal (dentro de `sistema-taller`):

```bash
mvn spring-boot:run
```

## URLs utiles
- Web: `http://localhost:8081`
- Clientes: `http://localhost:8081/clientes`
- Vehiculos: `http://localhost:8081/vehiculos`
- Mecanicos: `http://localhost:8081/mecanicos`
- Ordenes: `http://localhost:8081/ordenes`
- API base: `http://localhost:8081/api`
- Consola H2: `http://localhost:8081/h2-console`
  - JDBC URL: `jdbc:h2:mem:taller`
  - Usuario: `sa`
  - Password: (vacio)

## Flujo
Cliente HTML o JSON -> Controller -> Service -> Repository/JPA -> H2 -> Resultado

## Modelo
- Cliente: nombre, telefono, correo
- Vehiculo: placa, marca, modelo, anio, cliente
- Mecanico: nombre, especialidad
- OrdenTrabajo: vehiculo, mecanico, descripcion, costo, fecha, estado

Estados de orden: `RECIBIDO` -> `EN_PROCESO` -> `LISTO` -> `ENTREGADO`

## API REST

### Clientes
- GET `/api/clientes`
- GET `/api/clientes/{id}`
- POST `/api/clientes`
- PUT `/api/clientes/{id}`
- DELETE `/api/clientes/{id}`

Ejemplo POST `/api/clientes`:

```json
{
  "nombre": "Ana Lopez",
  "telefono": "5555-1234",
  "correo": "ana@example.com"
}
```

### Vehiculos
- GET `/api/vehiculos`
- GET `/api/vehiculos/{id}`
- POST `/api/vehiculos`
- PUT `/api/vehiculos/{id}`
- DELETE `/api/vehiculos/{id}`

Ejemplo POST `/api/vehiculos`:

```json
{
  "placa": "P123ABC",
  "marca": "Toyota",
  "modelo": "Corolla",
  "anio": 2018,
  "clienteId": 1
}
```

### Mecanicos
- GET `/api/mecanicos`
- GET `/api/mecanicos/{id}`
- POST `/api/mecanicos`
- PUT `/api/mecanicos/{id}`
- DELETE `/api/mecanicos/{id}`

Ejemplo POST `/api/mecanicos`:

```json
{
  "nombre": "Carlos Ruiz",
  "especialidad": "Motor"
}
```

### Ordenes
- GET `/api/ordenes`
- GET `/api/ordenes/{id}`
- POST `/api/ordenes`
- PUT `/api/ordenes/{id}`
- DELETE `/api/ordenes/{id}`
- POST `/api/ordenes/{id}/estado`

Ejemplo POST `/api/ordenes`:

```json
{
  "vehiculoId": 1,
  "mecanicoId": 1,
  "descripcion": "Cambio de aceite y filtros",
  "costo": 350.00
}
```

Ejemplo POST `/api/ordenes/1/estado`:

```json
{
  "estado": "EN_PROCESO"
}
```

## Notas
- Los datos estan en H2 en memoria: se pierden al apagar la aplicacion.
- Al iniciar se cargan datos de ejemplo para probar las pantallas.
- Las reglas de negocio son educativas (placa unica, no borrar clientes con vehiculos, avance de estado secuencial).
