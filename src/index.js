const path = require('path');
const fs = require('fs');
const { isPathAbsolute, convertAbsolute, existRoute, readRoute, isMarkdownFile, extractLinksFromFile, validateLinks, statsLinks } = require('./function');
const { getHeapStatistics } = require('v8');

const mdLinks = (route) => {
  return new Promise((resolve, reject) => {
    //Es una ruta absoluta
    const isAbsoluteRoute = isPathAbsolute(route)
    //Convertir a ruta absoluta
    const newRouteAbsolute = isAbsoluteRoute ? route : convertAbsolute(route)
    //Verificar que sea un archivo Markdown
    if (!isMarkdownFile(newRouteAbsolute)) {
      reject('La ruta no apunta a un archivo Markdown');
    }
    //Determina si existe la ruta 
    if (existRoute(newRouteAbsolute)) {
      readRoute(newRouteAbsolute)
        .then((files) => {
          const links = extractLinksFromFile(files, newRouteAbsolute);
          return validateLinks(links);
        })
        .then((validatedLinks) => {
          // Aquí `validatedLinks` contendrá los enlaces con su estado validado
          resolve({
            links: validatedLinks,
            stats: statsLinks(validatedLinks),
          });
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
