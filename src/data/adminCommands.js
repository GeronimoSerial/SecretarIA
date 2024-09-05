const {location} = require('./variables');

const adminCommands = {
    '!status': async (message) => {
        const now = new Date();
        const uptime = process.uptime();
        const os = require('os');
        const platform = os.platform();
        const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

        await message.reply(`Sistema operativo y funcionando. ${now} `);
        await message.reply(`Sistema operativo: ${platform}. Memoria en uso: ${Math.round(memoryUsage)} MB.`);
        await message.reply(`Tiempo en linea: ${Math.floor(uptime/60)} minutos `);
    },
    '!location': async (message) => {
        await message.reply(location);
    }
};

module.exports = adminCommands