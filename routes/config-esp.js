// routes/config-esp.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuration de la base MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'energy'
};

// GET /config-esp → envoyer la configuration vers l’ESP32
router.get('/', async (req, res) => {
  try {
    console.log("[ESP CONFIG] Connexion à MySQL en cours...");
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('SELECT 1'); // Juste pour tester la connexion

    console.log("[ESP CONFIG] Connexion MySQL OK ");

    const config = {
      system: {
        version: "1.0",
        default_zone: "Bujumbura",
        api_base_url: "http://10.119.171.158:3000/", //  Mets bien ton IP ici
        default_delay: 5000,
        message: "Connexion Node.js et MySQL établie avec succès"
      },
      modules: {
        pir: {
          enabled: true,
          zone: "zone1",
          delay: 30000,
          record_condition: "variation",
          actions: {
            on: {
              message: "Mouvement détecté",
              triggers: [
                { actionneur: "led_lj", action: "on", message: "Allumer LED_LJ" }
              ]
            },
            off: {
              message: "Fin de mouvement",
              triggers: [
                { actionneur: "led_lj", action: "off", message: "Éteindre LED_LJ" }
              ]
            }
          }
        },
        ultrasonic: {
          enabled: true,
          zone: "zone1",
          seuil: 2,
          record_condition: "variation",
          min_distance: 1,
          delay: 5000,
          actions: {
            distance: [
              {
                condition: { operator: "<", value: 50 },
                triggers: [
                  { actionneur: "led_lr", action: "on", message: "Allumer LED_LR (détection < 50cm)" },
                  { actionneur: "led_lw", action: "on", message: "Allumer LED_LW (détection < 50cm)" }
                ]
              },
              {
                condition: { operator: ">=", value: 50 },
                triggers: [
                  { actionneur: "led_lr", action: "off", message: "Éteindre LED_LR (détection >= 50cm)" },
                  { actionneur: "led_lw", action: "off", message: "Éteindre LED_LW (détection >= 50cm)" }
                ]
              }
            ]
          }
        },
        dht11: {
          enabled: true,
          zone: "zone1",
          seuil: 2,
          record_condition: "variation",
          delay: 5000,
          actions: {
            temp_distance: [
              {
                condition: {
                  temp: { operator: "<", value: 20 },
                  distance: { operator: "<", value: 100 }
                },
                triggers: [
                  { actionneur: "moteur", action: "on", message: "Allumer moteur (temp < 20°C et distance < 100cm)" }
                ]
              },
              {
                condition: {
                  temp: { operator: ">=", value: 20 }
                },
                triggers: [
                  { actionneur: "moteur", action: "off", message: "Éteindre moteur (temp >= 20°C)" }
                ]
              }
            ]
          }
        },
        ldr: {
          enabled: true,
          zone: "zone1",
          seuil: 5,
          seuil_lumiere: 400,
          record_condition: "variation",
          delay: 5000,
          actions: {
            luminosite: [
              {
                condition: { operator: "<", value: 400 },
                triggers: [
                  { actionneur: "led_lr", action: "on", message: "Allumer LED_LR (lumière faible)" }
                ]
              },
              {
                condition: { operator: ">=", value: 400 },
                triggers: [
                  { actionneur: "led_lr", action: "off", message: "Éteindre LED_LR (lumière suffisante)" }
                ]
              }
            ]
          }
        }
      },
      actionneurs: {
        zone: "zone1",
        enabled: true,
        actions: {
          led_lr: { on: "Allumer LED_LR", off: "Éteindre LED_LR" },
          led_lb: { on: "Allumer LED_LB", off: "Éteindre LED_LB" },
          led_lw: { on: "Allumer LED_LW", off: "Éteindre LED_LW" },
          led_lj: { on: "Allumer LED_LJ", off: "Éteindre LED_LJ" },
          moteur: { on: "Allumer moteur", off: "Éteindre moteur" }
        }
      },
      zones: {
        zone1: "Salon",
        zone2: "Chambre",
        zone3: "Cuisine"
      }
    };

    console.log("[ESP CONFIG] Envoi de la configuration JSON à l'ESP...");
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(config);

  } catch (err) {
    console.error("[ESP CONFIG] Erreur MySQL ou Node.js:", err.message);
    res.status(500).json({
      status: "error",
      message: "Impossible de se connecter à MySQL ou d’envoyer la config.",
      detail: err.message
    });
  }
});

module.exports = router;
