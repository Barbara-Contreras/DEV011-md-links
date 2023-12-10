const { mdLinks } = require('.');

const process = require('process');
const args = process.argv;
const path = args[2];
const validate = args.includes('--validate');
const stats = args.includes('--stats');

mdLinks(path, { validate: validate, stats: stats })
    .then((result) => {
        if (!validate && !stats) {
            for (let i = 0; i < result.links.length; i++) {
                console.log(`href: ${result.links[i].href}`);
                console.log(`text: ${result.links[i].text}`);
                console.log(`file: ${result.links[i].file}`);
                console.log('------------------------');
            }
        } else {
            if (validate) {
                for (let i = 0; i < result.links.length; i++) {
                    const status = result.links[i].status === 'OK' ? 'ok' : 'fail';
                    console.log(`href: ${result.links[i].href}`);
                    console.log(`text: ${result.links[i].text}`);
                    console.log(`file: ${result.links[i].file}`);
                    console.log(`status: ${result.links[i].status}`);
                    console.log(`ok: ${status}`);
                    console.log('------------------------');
                }
            }

            if (stats) {
                console.log(`Total: ${result.stats.total}`);
                console.log(`Unique: ${result.stats.unique}`);
                console.log(`Broken: ${result.stats.broken}`);
            }
        }
    })
    .catch((error) => {
        console.error(error);
    });