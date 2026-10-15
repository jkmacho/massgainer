# massgainer
Diario de fuerza: PWA sin dependencias para apuntar los entrenamientos. Funciona sin conexión y guarda los datos en el propio móvil (o en la base de datos de Claude si se abre como artifact).

## Qué hace
- **Entrenar**: sesiones A, B y Libre con tabla de series, sugerencia de peso, temporizador de descanso (general o propio de cada ejercicio) y notas: una fija por ejercicio que sale siempre y otra del día que queda en el historial.
- **Añadir y cambiar ejercicios**: selector a pantalla completa con figura del cuerpo (delante y detrás), filtros por músculo y material y buscador. "Cambiar" propone ejercicios parecidos del mismo músculo, solo para ese día.
- **Ficha de cada ejercicio**: fotos animadas, músculos marcados en la figura, cómo se hace, nota fija e historial con la mejor serie.
- **Historial**, **Progreso** (gráfica por ejercicio y mapa de músculos trabajados en 7 o 30 días), **Pruebas** físicas y **Plan** por fases, con exportación a Excel/CSV y copia de seguridad.

## Biblioteca de ejercicios
`ejercicios.js` tiene los ejercicios que se pueden hacer con el material de casa (mancuernas, kettlebell, polea, barra y peso corporal), con músculos, técnica en español y fotos en `ex/`. El service worker descarga todas las fotos por detrás para que se vean sin conexión.
Las fotos y los músculos vienen de [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (dominio público), reducidas a 360 px.

Los ejercicios creados a mano en el Plan pueden indicar músculo y material para que también salgan en la figura y en Progreso.

## Publicar una versión nueva
Subir `VERSION` en `sw.js` para que los móviles con la app instalada recojan los cambios.
