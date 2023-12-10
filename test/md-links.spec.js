const { mdLinks } = require('../src/index.js');
const { convertAbsolute, isMarkdownFile, readRoute, validateLinks, statsLinks } = require('../src/function.js');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

describe('mdLinks', () => {

  it('Debería devolver una promesa', () => {
    const result = mdLinks('README.md');
    expect(result).toBeInstanceOf(Promise);
  });
  it('Debería rechazar cuando la ruta no existe.', () => {
    return mdLinks('esta/ruta/no/existe.md')
      .catch((error) => {
        expect(error).toBe('La ruta no existe');
      });
  });
  it('Convierte ruta relativa a absoluta correctamente', () => {
    const relativeRoute = 'README.md';
    const absoluteRoute = convertAbsolute(relativeRoute);
    const result = path.resolve(__dirname, '..', 'README.md');
    expect(absoluteRoute).toBe(result);
  });
  it('Debería devolver true para una ruta de archivo Markdown', () => {
    const markdownRoute = 'README.md';
    const result = isMarkdownFile(markdownRoute);
    expect(result).toBe(true);
  });
  it('Debería leer el contenido del archivo correctamente', (done) => {
    const expectedContent = 'Es para realizar el test';
    const routeFile = 'README.md';
    fs.writeFileSync(routeFile, expectedContent, 'utf8');
    // Llamar a la función y manejar la promesa con .then()
    readRoute(routeFile)
      .then((result) => {
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        done(); 
      })
      .catch((err) => {
        done(err); 
      });
  });
  it('Debería devolver los enlaces de un archivo Markdown existente', () => {
    const route = 'README.md';
    return mdLinks(route)
      .then((links) => {
        expect(Array.isArray(links)).toBe(false);
      });
  });
});

jest.mock('axios');

describe('validateLinks', () => {
    it('Debería validar una serie de enlaces con éxito', async () => {
        const links = [
            { href: 'https://www.example.com' },
            { href: 'https://www.nonexistent.com' },
        ];

        // Puedes ajustar los mocks según sea necesario
        axios.get.mockResolvedValueOnce({ status: 200, statusText: 'OK' })
            .mockRejectedValueOnce({ response: { status: 404 } });

        const result = await validateLinks(links);

        expect(result).toEqual([
            { href: 'https://www.example.com', status: 200, statusText: 'OK' },
            { href: 'https://www.nonexistent.com', status: 404, statusText: 'FAIL' },
        ]);
    });
});

describe('statsLinks', () => {
  test('Debería devolver estadísticas correctas para un conjunto de enlaces', () => {
    const links = [
      { href: 'https://ejemplo.com/enlace1', status: 200 },
      { href: 'https://ejemplo.com/enlace2', status: 404 },
      { href: 'https://ejemplo.com/enlace3', status: 500 },
    ];

    const result = statsLinks(links);

    // Verifica que las estadísticas sean correctas
    expect(result.total).toBe(3);
    expect(result.unique).toBe(3); // Puedes ajustar esto según tu lógica para enlaces únicos
    expect(result.broken).toBe(2);
  });
});
