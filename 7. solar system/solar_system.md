# Sistema Solar
## Eduardo Gallegos Solis
## A01745776

### Requerimientos:
- Se crean 8 planetas (más plutón) con sus respectivas lunas.
- Se crea el sol al centro.
- Se crea el cinturón de asteroides entre Marte y Júpiter.
- Los planetas y las lunas tienen rotación.
- Las lunas rotan al rededor de sus planetas.
- Los planetas rotan al rededor del sol.
- Se dibuja la órbita de cada planeta y el cinturón de asteroides
- Cada elemento tiene su propio material.
- La escena se controla con un Orbit Controller de Three.js

### Pasos:
1. Se creó la clase Planeta para poder crear a los distintos elementos del sistema solar. En dicha clase se dibuja el planeta y su órbita.
2. La posición inicial del planeta se calcula de forma aleatoria dentro de su órbita.
3. Dentro de la misma clase se anima cada planeta y sus lunas
4. Se creó la clase Asteroide para crear y controlar los asteroides del cinturón de asteroides.
5. Se agregó el Orbit Controller para poder controlar la escena con ayuda del mouse.
6. La escena crea en base a las escenas creadas en tareas previas.