const cron = require('node-cron');
const telegram = require('./telegram');

// Programação do cron

cron.schedule(' * * * * *', () => {

    console.log('cron rodando a cada minuto');

    telegram.sendMessenge();

})

module.exports = cron;