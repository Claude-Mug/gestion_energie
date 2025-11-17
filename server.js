const ip = require("ip");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

// Charger le fichier .env AVANT tout
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Import Sequelize (instance déjà configurée pour Railway)
const sequelize = require("./utils/sequerize");

// Import des modèles (IMPORTANT sinon Sequelize ne crée pas les tables)
require("./models/ultrasonic");
require("./models/pir");
require("./models/pir");
require("./models/dht11");
require("./models/actionneurs");
require("./models/user");

// === CONFIG SERVER ===
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

// Initialiser Socket.IO
initSocket(server);

// === SYNC DATABASE ===
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connexion à aiven réussie !");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("📦 Base de données synchronisée.");

    server.listen(PORT, HOST, () => {
      console.log(`
=========================================================
  🚀 Serveur démarré avec succès !

  🌐 Accès local:    http://localhost:${PORT}
  📡 Accès réseau:   http://${ip.address()}:${PORT}

  🛢  Base:           ${process.env.DB_NAME}
  🗄  Host DB:        ${process.env.DB_HOST}
  🔐 User DB:        ${process.env.DB_USER}
=========================================================
      `);
    });
  })
  .catch((err) => {
    console.error("❌ ERREUR de connexion ou synchronisation DB :", err);
    process.exit(1);
  });
