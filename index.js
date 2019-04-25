//Todo: Comment out dotenv in production
//require('dotenv').config();
const server = require('./server');

const port = process.env.PORT || 5000;

server.listen(port, _ => console.log(`\n\n \u{1F680} \u{1F680} \u{1F680} \u{1F680} Server running on port ${port} \n\n`))