# Audio para Invitación de Boda

## Cómo agregar audio de YouTube

### Opción 1: Descargar audio de YouTube
1. Ve al video de YouTube que quieres usar
2. Copia la URL del video
3. Usa una herramienta online como:
   - https://ytmp3.cc/
   - https://www.y2mate.com/
   - https://mp3download.to/
4. Descarga el archivo como MP3
5. Renombra el archivo a `wedding-invitation.mp3`
6. Colócalo en esta carpeta (`public/audio/`)

### Opción 2: Usar yt-dlp (recomendado)
```bash
# Instalar yt-dlp
pip install yt-dlp

# Descargar solo el audio
yt-dlp -x --audio-format mp3 -o "wedding-invitation.%(ext)s" "URL_DEL_VIDEO_DE_YOUTUBE"

# Mover el archivo a la carpeta correcta
mv wedding-invitation.mp3 public/audio/
```

### Configuración en el código
En el archivo `pages/rsvp/[eventId]/[groupId].js`, actualiza la línea:
```javascript
const youtubeVideoId = 'TU_VIDEO_ID_AQUI'; // Reemplaza con el ID de tu video
```

El ID del video es la parte después de `v=` en la URL de YouTube.
Por ejemplo, si la URL es `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, 
el ID es `dQw4w9WgXcQ`.

### Formatos soportados
- MP3 (recomendado)
- WAV
- OGG

### Notas importantes
- El archivo de audio debe ser relativamente pequeño (< 5MB) para carga rápida
- Asegúrate de tener los derechos para usar la música
- El audio se reproducirá automáticamente al hacer clic en la carta 