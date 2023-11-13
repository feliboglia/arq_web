# Arquitectura Web - TP

API  de una app muy rudimentaria (sin validaciones) para guardar notas simples.

### Estructura

- Users
- Notes
- Projects

### Endpoints

## Notas

**GET /notes/**  Devuelve una lista de todas las notas.  
**GET /notes/:owner**  Devuelve las listas del usuario.   
**GET /notes/?noteId=x**  Devuelve la nota con el id especificado por query.  
**GET /notes/t/:title**  Devuelve la nota a partir del título especificado.  
__

**POST /notes/**  Crea una nueva nota. Parametros necesarios: noteId, title, content, owner.
__

**PUT /notes/:noteId**  Actualiza una nota. Parametros posibles: name, content, owner.
__

**DELETE /notes/:noteId**  Elimina la nota con el id especificado.  


---

## Usuarios

**GET /users/**  Devuelve una lista de todos los usuarios.  
**GET /users/:userId**  Devuelve información del usuario indicado por id.   
**GET /users/e/:email**  Devuelve el usuario a partir del email especificado.  
__

**POST /users/**  Crea un nuevo usuario. Parametros necesarios: userId, username, email, name.
__

**PUT /users/:userId**  Actualiza un usuario. Parametros posibles: name, email.
__

**DELETE /users/:userId**  Elimina el usuario con el id especificado.  

---

## Proyectos

**GET /projects/**  Devuelve una lista de todos los proyectos.  
**GET /projects/:projectId/notes**  Devuelve las notas del proyecto.   
__

**POST /projects/**  Crea un nuevo proyecto. Parametros necesarios: projectId, name, notes (lista de notas), owner.
__

**PUT /projects/:projectId/notes**  Agrega notas. Parametrosd necesarios: notas (ids).
__

**DELETE /projects/:projectId**  Elimina el proyecto con el id especificado.  

---

## Next steps
- Validaciones por id
- Mejorar el handling de errores
- Agregar funcionalidad a los proyectos