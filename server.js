const ip = require("ip");
const path = require("path");
const dotenv = require("dotenv");
const http = require('http');
const app = require('./app'); // Importez l'instance de l'application Express
const { initSocket } = require('./socket');

// Importez Sequelize et tous vos modèles pour la synchronisation
const sequelize = require('./utils/sequerize');
const { Ultrasonic, Pir, Dht11, Ldr, Actionneur, User } = require('./models'); // Importez TOUS vos modèles ici

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(app);

// Initialiser Socket.IO
initSocket(server);

// Synchronisation de la base de données
// Cette partie s'exécute AVANT le démarrage du serveur pour s'assurer que les tables sont prêtes.
sequelize.sync({ alter: true }) // `alter: true` tente de faire des modifications non destructives
    .then(() => {
        console.log('Base de données synchronisée.');
        // Démarrage du serveur uniquement après la synchronisation réussie
        server.listen(PORT, HOST, () => {
            const serverUrl = `http://${ip.address()}:${PORT}`;
            const localUrl = `http://localhost:${PORT}`;

            console.log(`
    =========================================================
     Serveur démarré avec succès!
     
     Accès local:    ${localUrl}
     Accès réseau:   ${serverUrl}
     
     Environnement:  ${process.env.NODE_ENV || 'development'}
    =========================================================
            `);
        });
    })
    .catch(err => {
        console.error('Erreur de synchronisation de la base de données:', err);
        // Quitte le processus si la synchronisation échoue
        process.exit(1);
    });
