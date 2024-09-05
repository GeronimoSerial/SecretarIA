const {Location} = require('whatsapp-web.js');

// variable de ubicación
const latitude = -34.603722;
const longitude = -58.381592;
const description = 'Catamarca, Argentina';
const location = new Location(latitude, longitude, description);


//administradores
const admins = ['5493794376025@c.us'];



module.exports = {location, admins};