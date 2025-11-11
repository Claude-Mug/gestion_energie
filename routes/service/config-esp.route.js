const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Import des contrôleurs
const { getLastEtat: getUltrasonicLastEtat } = require('../../controllers/service/ultrasonic.Controller');
const { getLastEtat: getPirLastEtat } = require('../../controllers/service/pir.Controller');
const { getLastEtat: getDht11LastEtat } = require('../../controllers/service/dht11.Controller');
const { getLastEtat: getLdrLastEtat } = require('../../controllers/service/ldr.Controller');
const actionneursController = require('../../controllers/service/actionneurs.Controller');

// Configuration MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'energie'
};

// Fonction utilitaire pour récupérer l'état d'un module
const getModuleEnabledState = async (getLastEtatFunction, moduleName) => {
    const mockReq = {};
    const mockRes = {
        status: function() { return this; },
        json: function(data) {
            this.responseData = data;
            return this;
        }
    };

    try {
        await getLastEtatFunction(mockReq, mockRes);
        const moduleStateData = mockRes.responseData;
        return moduleStateData && moduleStateData.etat !== undefined 
            ? moduleStateData.etat 
            : false;
    } catch (error) {
        console.error(`Erreur module ${moduleName}:`, error.message);
        return false;
    }
};

// Fonction pour récupérer TOUS les états des actionneurs
const getAllActuatorStates = async () => {
    const mockReq = {};
    const mockRes = {
        status: function() { return this; },
        json: function(data) { this.responseData = data; return this; }
    };

    try {
        await actionneursController.getAllLastEtats(mockReq, mockRes);
        return mockRes.responseData;
    } catch (error) {
        console.error("Erreur récupération actionneurs:", error);
        return null;
    }
};

// Route principale
router.get('/', async (req, res) => {
  try {
    // Test connexion MySQL (optional, you can remove if not strictly needed for this endpoint)
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('SELECT 1');

    // Récupération états modules
    const isUltrasonicEnabled = await getModuleEnabledState(getUltrasonicLastEtat, "ultrasonic");
    const isPirEnabled = await getModuleEnabledState(getPirLastEtat, "PIR");
    const isDht11Enabled = await getModuleEnabledState(getDht11LastEtat, "DHT11");
    const isLdrEnabled = await getModuleEnabledState(getLdrLastEtat, "LDR");
    
    // Récupération TOUS les états actionneurs
    const actuatorStates = await getAllActuatorStates();

    // Construction de la réponse avec uniquement les derniers états
    const lastStates = {
      sensors: {
        pir: {
          enabled: isPirEnabled,
        },
        ultrasonic: {
          enabled: isUltrasonicEnabled,
        },
        dht11: {
          enabled: isDht11Enabled,
        },
        ldr: {
          enabled: isLdrEnabled,
        }
      },
      actuators: actuatorStates || {}
    };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lastStates);
  } catch (err) {
    console.error("Erreur configuration ESP:", err.message);
    res.status(500).json({
      status: "error",
      message: "Erreur serveur",
      detail: err.message
    });
  }
});

module.exports = router;