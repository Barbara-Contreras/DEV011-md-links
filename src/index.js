const path = require('path');
const fs = require('fs');
const { isPathAbsolute, convertAbsolute, existRoute, readRoute, isMarkdownFile, extractLinksFromFile, validateLinks, statsLinks } = require('./function');
const { getHeapStatistics } = require('v8');

const mdLinks = (route, options = { validate: false, stats: false }) => {
  return new Promise((resolve, reject) => {
    // Es una ruta absoluta
    const isAbsoluteRoute = isPathAbsolute(route);
    // Convertir a ruta absoluta
    const newRouteAbsolute = isAbsoluteRoute ? route : convertAbsolute(route);
    // Verificar que sea un archivo Markdown
    if (!isMarkdownFile(newRouteAbsolute)) {
      reject('La ruta no apunta a un archivo Markdown');
    }
    // Determina si existe la ruta
    if (existRoute(newRouteAbsolute)) {
      readRoute(newRouteAbsolute)
        .then((files) => {
          const links = extractLinksFromFile(files, newRouteAbsolute);
          if (!options.validate && !options.stats) {
            // Si no se proporcionan opciones de validación o estadísticas,
            // simplemente resuelve los enlaces
            resolve({
              links,
            });
          } else {
            // Si se proporcionan opciones de validación o estadísticas,
            // realiza las operaciones necesarias
            validateLinks(links)
              .then((validatedLinks) => {
                if (options.stats) {
                  resolve({
                    links: validatedLinks,
                    stats: statsLinks(validatedLinks),
                  });
                } else {
                  resolve({
                    links: validatedLinks,
                  });
                }
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject('La ruta no existe');
    }
  });
};

module.exports = {
  mdLinks
};
