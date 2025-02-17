const {Location} = require('whatsapp-web.js');

// variable de ubicación
const latitude = -27.4650556;
const longitude = -58.8328056;
const description = 'Corrientes, Argentina';
const location = new Location(latitude, longitude, description);


//administradores
const admins = ['5493794376025@c.us'];



module.exports = {location, admins};