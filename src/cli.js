const { mdLinks } = require(".");

    mdLinks('README.md').then(res => console.log(res)).catch(err => console.log(err))

//Incluir validate (true o false con condicional)