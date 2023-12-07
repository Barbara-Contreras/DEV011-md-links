//Funciones del hito 1
const path = require('path');
const fs = require('fs');
const axios = require('axios');

//Determina si es una ruta absoluta
const isPathAbsolute = (route) => path.isAbsolute(route);

//Si no lo es, la convierte
const convertAbsolute = (route) => path.resolve(route);

//Determina si existe la ruta
const existRoute = (route) => fs.existsSync(route);

//Identificar que sea un archivo markdown

const isMarkdownFile = (route) => {
    const extFile = path.extname(route);
    return extFile.toLowerCase() === '.md';
};

//Si existe, lee el archivo 
const readRoute = (route) => {
    return new Promise((resolve, reject) => {
        fs.readFile(route, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Función para extraer enlaces de un archivo Markdown
const extractLinksFromFile = (text, route) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = [];
    let match;
    //const filetext = path.basename(text);
    while ((match = regex.exec(text)) !== null) {
        matches.push({
            href: match[2],
            text: match[1],
            file: route,
        });
    }
    return matches;
};

//Función para validar links 
const validateLink = (link) => {
    return axios.get(link.href)
        .then((res) => {
            link.status = res.status;
            link.statusText = res.statusText;
            return link;
        })
        .catch((error) => {
            link.status = !error.response ? 404 : error.response.status;
            link.statusText = 'FAIL';
            return link;
        });
};

const validateLinks = (links) => {
    const validateArr = links.map((link) => validateLink(link));

    return Promise.all(validateArr)
        .catch(error => console.error(error));
};

//Función para realizar estadísticas de links

const statsLinks = (links) => {
    const totalLinks = links.length;
    const uniqueLinks = [...new Set(links.map(link => link.href))].length;
    const brokenLinks = links.filter(link => link.status === 404).length;
  
    return {
      total: totalLinks,
      unique: uniqueLinks,
      broken: brokenLinks,
    };
  }

module.exports = {
    isPathAbsolute,
    convertAbsolute,
    existRoute,
    isMarkdownFile,
    readRoute,
    extractLinksFromFile,
    validateLinks,
    statsLinks
}