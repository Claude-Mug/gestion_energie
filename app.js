require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const i18n = require('i18n');
const path = require('path');
const jwt = require('jsonwebtoken');
const sequelize = require('./utils/sequerize');
const User = require('./models/user'); // Assurez-vous que le nom du fichier est 'User.js' et non 'user.js'
const iotDataController = require('./controllers/iotDataController');

const app = express();

// i18n pour multi-langue
i18n.configure({
    locales: ['fr', 'en'],
    directory: path.join(__dirname, 'config', 'lang'),
    defaultLocale: 'fr',
    queryParameter: 'lang',
    autoReload: true,
    syncFiles: true
});

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(i18n.init);

// Vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares customs
const requireAuth = require('./middlewares/requireAuth');
const authorize = require('./middlewares/authorize'); 
const iotAuthorize = require('./middlewares/iotAuthorize');
const bindUser = require('./middlewares/bindUser');
const authenticateToken = require('./middlewares/authenticateToken');
app.use(bindUser);

// ===================== Routes d'Authentification =====================
app.use('/api/auth', require('./routes/auth/auth.route'));

// ===================== Routes de gestion des Rôles =====================
// Cette route pourrait être protégée par requireAuth et authorize si vous voulez limiter qui peut voir la liste des rôles
app.use('/api/roles', requireAuth, authorize(['Admin', 'Technicien']), require('./routes/user/role.route')); // <-- NOUVELLE ROUTE : Pour obtenir la liste des rôles
// ===================== Routes de gestion des Utilisateurs (CRUD) =====================
// Ces routes sont généralement protégées et accessibles uniquement par les administrateurs
app.use('/api/users', requireAuth, authorize('Admin'), require('./routes/user/user.route')); // <-- NOUVELLE ROUTE : Gestion des utilisateurs

// ===================== Routes existantes =====================
app.use('/api/uploads', require('./class/uploads/UsersUpload'));
app.use('/api/uploads', require('./class/uploads/AdminUpload'));
app.use('/config-esp', require('./routes/service/config-esp.route'));

app.post('/api/iot/data',  iotDataController.sendDataToDatabase);
// elle utilise la clé API pré-partagée.
app.post('/api/auth/esp32-login', (req, res) => {
    const { apiKey } = req.body; 

    console.log(`[AUTH-ESP32] Tentative de connexion avec API Key: ${apiKey ? 'Présente' : 'Absente'}`);

    // Vérifie si la clé API fournie correspond à celle définie dans vos variables d'environnement (.env)
    if (apiKey === process.env.ESP32_API_KEY) {
        // Clé API valide, générer un token JWT pour cet ESP32
        const token = jwt.sign(
            { device: 'ESP32', deviceId: 'mon_esp32_alpha_1' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3h' } 
        );
        console.log("[AUTH-ESP32] Connexion réussie, token généré.");
        return res.status(200).json({ token: token, message: "Authentification ESP32 réussie." });
    } else {
        console.warn("[AUTH-ESP32] Échec de connexion: Clé API non valide.");
        return res.status(401).json({ message: 'Clé API non valide.' });
    }
});

// Route pour l'ESP32 pour ENVOYER les données des capteurs/actionneurs

app.post('/iot/data', iotDataController.sendDataToDatabase);
// Route pour l'ESP32 pour RÉCUPÉRER la configuration et les états de modules/actionneurs
app.get('/config-esp', iotDataController.getAllModuleAndActuatorStates);

// ===================== Routes IoT (Capteurs & Actionneurs) =====================
// Ces routes nécessitent d'abord une authentification, puis l'autorisation spécifique IoT.
// Nous appliquons 'iotAuthorize' une seule fois pour tout le groupe de routes IoT.
app.use('/api/ultrasonic', requireAuth, iotAuthorize, authenticateToken, require('./routes/service/ultrasonic.route'));
app.use('/api/pir', requireAuth, iotAuthorize, authenticateToken, require('./routes/service/pir.route'));
app.use('/api/ldr', requireAuth, iotAuthorize, authenticateToken, require('./routes/service/ldr.route'));
app.use('/api/dht11', requireAuth, iotAuthorize, authenticateToken, require('./routes/service/dht11.route'));
app.use('/api/actionneurs', requireAuth, iotAuthorize, authenticateToken, require('./routes/service/actionneurs.route'));



// Route accueil (vue HTML EJS)
app.get('/', (req, res) => {
    res.render('index');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).render('404', { path: req.path });
});

// Exportez l'application, sans la synchronisation de la DB ni l'écoute du port
module.exports = app;