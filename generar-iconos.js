const fs = require('fs');
const path = require('path');

// 1. Leemos el JSON que generaste anteriormente
const inputPath = path.join(__dirname, 'src/assets/icons-primeng.json');
// 2. Definimos dónde guardar la clase TypeScript (ajusta la ruta según tu estructura)
const outputPath = path.join(__dirname, 'src/app/api/font-awesome.ts');

try {
    const rawData = fs.readFileSync(inputPath);
    const icons = JSON.parse(rawData);

    // Encabezado del archivo
    let fileContent = `export class FontAwesome {\n`;

    icons.forEach((icon) => {
        // Transformamos el "label" en un nombre de variable válido (UPPER_CASE)
        // Ejemplo: "0 (solid)" -> "ZERO_SOLID" o "NUM_0_SOLID"

        let key = icon.label
            .toUpperCase()
            .replace(/\(SOLID\)/, '_SOLID') // Marcamos estilo
            .replace(/\(REGULAR\)/, '_REGULAR')
            .replace(/\(BRANDS\)/, '_BRAND')
            .replace(/[^A-Z0-9]/g, '_') // Reemplazamos símbolos por guiones bajos
            .replace(/_+/g, '_') // Quitamos guiones dobles
            .replace(/_$/, '') // Quitamos guión final
            .trim();

        // Si la variable empieza con número (ej: 0_SOLID), le agregamos un prefijo porque en TS no puede empezar por número
        if (/^[0-9]/.test(key)) {
            key = 'ICON_' + key;
        }

        // Agregamos la línea: public static readonly HOUSE_SOLID = 'fas fa-house';
        fileContent += `    public static readonly ${key} = '${icon.value}';\n`;
    });

    fileContent += `}`;

    // Creamos el directorio si no existe
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log(`¡Clase generada con éxito en: ${outputPath}`);
} catch (error) {
    console.error('Error:', error.message);
}
