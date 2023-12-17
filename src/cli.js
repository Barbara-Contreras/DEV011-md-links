#!/usr/bin/env node
const { mdLinks } = require('.');

const process = require('process');
const args = process.argv;
const path = args[2];
const validate = args.includes('--validate');
const stats = args.includes('--stats');

mdLinks(path, { validate: validate, stats: stats })
    .then((result) => {
        let output = '';

        if (!validate && !stats) {
            for (let i = 0; i < result.links.length; i++) {
                output += `href: ${result.links[i].href}\n`;
                output += `text: ${result.links[i].text}\n`;
                output += `file: ${result.links[i].file}\n`;
                output += '------------------------\n';
            }
        } else {
            if (validate) {
                for (let i = 0; i < result.links.length; i++) {
                    const status = result.links[i].status === 'OK' ? 'ok' : 'fail';
                    output += `href: ${result.links[i].href}\n`;
                    output += `text: ${result.links[i].text}\n`;
                    output += `file: ${result.links[i].file}\n`;
                    output += `status: ${result.links[i].status}\n`;
                    output += `ok: ${status}\n`;
                    output += '------------------------\n';
                }
            }

            if (stats) {
                output += `Total: ${result.stats.total}\n`;
                output += `Unique: ${result.stats.unique}\n`;

                // Añadir esta condición para evitar imprimir los enlaces rotos cuando solo se pide --stats
                if (validate) {
                    output += `Broken: ${result.stats.broken}\n`;
                }
            }
        }
        // Imprimir la salida al final
        console.log(output);
    })
    .catch((error) => {
        console.error(error);
    });