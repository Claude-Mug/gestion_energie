//Importation des modèles
const Dht11 = require('../models/dht11');
const Ldr = require('../models/ldr');
const Pir = require('../models/pir');
const Ultrasonic = require('../models/ultrasonic');
const Actionneurs = require('../models/actionneurs');

// Import des fonctions logiques
const { logicPir } = require('../controllers/logic/pir.logic');
const { logicultrasonic } = require('../controllers/logic/ultrasonic.logic');
const { logicDht11 } = require('../controllers/logic/dht11.logic'); // Assurez-vous que logicDht11 est exporté
const { logicLdr } = require('../controllers/logic/ldr.logic');     // Assurez-vous que logicLdr est créé et exporté
const { logicActionneurs } = require('../controllers/logic/actionneurs.logic');

// Fonction 1: Envoie des données à la base de données
// iotDataController.js
const sendDataToDatabase = async (req, res) => {
    const { type, ...data } = req.body; 

    if (!type) {
        return res.status(400).json({ message: "Le type de module/actionneur est requis." });
    }

    try {
        let formattedData;

        switch (type) {
            case 'pir':
                formattedData = logicPir(data.value);
                // Ne pas enregistrer si état inactif
                if (!formattedData.etat) {
                    return res.status(200).json({ 
                        message: "État inactif - données non enregistrées",
                        data: formattedData
                    });
                }
                await Pir.create(formattedData);
                break;
                
            case 'ultrasonic':
                formattedData = logicultrasonic(data.value);
                if (!formattedData.etat) {
                    return res.status(200).json({ 
                        message: "Zone libre - données non enregistrées",
                        data: formattedData
                    });
                }
                await Ultrasonic.create(formattedData);
                break;
                
            case 'dht11':
                formattedData = logicDht11(data.values.temperature, data.values.humidity);
                if (!formattedData.etat) {
                    return res.status(200).json({ 
                        message: "Conditions normales - données non enregistrées",
                        data: formattedData
                    });
                }
                await Dht11.create(formattedData);
                break;
                
            case 'ldr':
                formattedData = logicLdr(data.value);
                if (!formattedData.etat) {
                    return res.status(200).json({ 
                        message: "Luminosité normale - données non enregistrées",
                        data: formattedData
                    });
                }
                await Ldr.create(formattedData);
                break;
                
            case 'actuator_update':
                formattedData = logicActionneurs(data);
                // Toujours enregistrer les actionneurs
                await Actionneurs.create(formattedData);
                break;
                
            default:
                return res.status(400).json({ message: "Type non reconnu." });
        }

        res.status(201).json({ 
            message: `${type} données enregistrées`, 
            data: formattedData 
        });
    } catch (error) {
        console.error(`Erreur enregistrement ${type}:`, error);
        res.status(500).json({ 
            message: `Erreur serveur`,
            error: error.message 
        });
    }
};

const getAllModuleAndActuatorStates = async (req, res) => {
  // Cette fonction n'a pas besoin de modifications car elle lit déjà les données formatées
  // telles qu'elles devraient être enregistrées maintenant.
  try {
    const states = {};

    // 1. Récupération du dernier snapshot des actionneurs
    // Note: Le code ici suppose que le modèle Actionneurs enregistre chaque état
    // d'actionneur comme une propriété directe (led_lr, moteur, buzzer etc.)
    const lastSnapshot = await Actionneurs.findOne({ 
        order: [['id', 'DESC']] 
    });

    if (lastSnapshot) {
        const plainSnapshot = lastSnapshot.toJSON();
        const actuatorTypes = ['moteur', 'led_lr', 'led_lb', 'led_lw', 'led_lj', 'buzzer'];
        
        // Itérer sur les types d'actionneurs pour récupérer leur état du snapshot
        actuatorTypes.forEach(type => {
            // Vérifier si la propriété existe et est booléenne (ou 0/1)
            if (typeof plainSnapshot[type] === 'boolean' || plainSnapshot[type] === 0 || plainSnapshot[type] === 1) {
                states[type] = `Etat = ${plainSnapshot[type] ? 1 : 0} - ${plainSnapshot[type] ? 'Allumé' : 'Éteint'}`;
            } else {
                states[type] = "Etat inconnu (donnée manquante ou invalide)";
            }
        });
        // Si vous voulez aussi la description générée par la logique
        if (plainSnapshot.description) {
            states.actionneursDescription = plainSnapshot.description;
        }

    } else {
        // Si aucun snapshot, initialiser tous les états à inconnu
        const actuatorTypes = ['moteur', 'led_lr', 'led_lb', 'led_lw', 'led_lj', 'buzzer'];
        actuatorTypes.forEach(type => {
            states[type] = "Etat inconnu (aucun enregistrement)";
        });
    }

    // 2. Capteurs
    // PIR
    const latestPir = await Pir.findOne({ order: [['createdAt', 'DESC']] });
    states.pir = latestPir 
        ? `Etat = ${latestPir.etat} - ${latestPir.action}` // Utilisez 'etat' et 'action' de la logique
        : "Pas de données";

    // Ultrasonic
    const latestUltrasonic = await Ultrasonic.findOne({ order: [['createdAt', 'DESC']] });
    states.ultrasonic = latestUltrasonic 
        ? `Etat = ${latestUltrasonic.etat} - ${latestUltrasonic.action}` 
        : "Pas de données";

    // DHT11
    const latestDht11 = await Dht11.findOne({ order: [['createdAt', 'DESC']] });
    if (latestDht11) {
      states.dht11 = {
        Etat: `Etat = ${latestDht11.etat} - ${latestDht11.action}`, // Utilisez 'etat' et 'action' de la logique
        temperature: `${latestDht11.temperature} °C`,
        humidite: `${latestDht11.humidite} %`
      };
    } else {
      states.dht11 = "Pas de données";
    }

    // LDR
    const latestLdr = await Ldr.findOne({ order: [['createdAt', 'DESC']] });
    if (latestLdr) {
      states.ldr = `Etat = ${latestLdr.etat} - ${latestLdr.action}`; // Utilisez 'etat' et 'action' de la logique
    } else {
      states.ldr = "Pas de données";
    }

    res.status(200).json(states);
  } catch (error) {
    console.error("Erreur récupération états:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

module.exports = {
    sendDataToDatabase,
    getAllModuleAndActuatorStates
};