const express = require('express');
const router = express.Router();
const Pir = require('../../models/pir');
const Ldr = require('../../models/ldr');
const Ultrasonic = require('../../models/ultrasonic');
const Dht11 = require('../../models/dht11');
const Actionneurs = require('../../models/actionneurs');

router.get('/config-esp', async (req, res) => {
  try {
    const states = {};

    // PIR
    const latestPir = await Pir.findOne().sort({ createdAt: -1 });
    if (latestPir) {
      states.pir = `Etat = ${latestPir.etat_mouvement} - ${latestPir.etat_mouvement ? 'Actif' : 'Inactif'}`;
    } else {
      states.pir = "Aucune donnée";
    }

    // ULTRASONIC
    const latestUltrasonic = await Ultrasonic.findOne().sort({ createdAt: -1 });
    if (latestUltrasonic) {
      states.ultrasonic = `Etat = 1 - Actif`;
    } else {
      states.ultrasonic = "Aucune donnée";
    }

    // DHT11
    const latestDht11 = await Dht11.findOne().sort({ createdAt: -1 });
    if (latestDht11) {
      states.dht11 = {
        Etat: `Etat = 1 - Actif`,
        temperature: `${latestDht11.temperature} °C`,
        humidite: `${latestDht11.humidite} %`
      };
    } else {
      states.dht11 = "Aucune donnée";
    }

    // LDR
    const latestLdr = await Ldr.findOne().sort({ createdAt: -1 });
    if (latestLdr) {
      states.ldr = `Etat = ${latestLdr.luminosite_niveau > 100 ? 1 : 0} - ${latestLdr.luminosite_niveau > 100 ? 'Actif' : 'Inactif'}`;
    } else {
      states.ldr = "Aucune donnée";
    }

    // ACTIONNEURS
    const actuatorTypes = ['moteur', 'led_lr', 'led_lb', 'led_lw', 'led_lj'];
    states.actionneurs = {};
    for (const type of actuatorTypes) {
      const latest = await Actionneurs.findOne({ type }).sort({ createdAt: -1 });
      if (latest) {
        states.actionneurs[type] = `Etat = ${latest.etat} - ${latest.etat ? 'Allumé' : 'Éteinte'}`;
      } else {
        states.actionneurs[type] = "Aucune donnée";
      }
    }

    console.log("[ESP CONFIG] Envoi de la configuration JSON à l’ESP...");
    res.status(200).json(states);
  } catch (error) {
    console.error("[ESP CONFIG] Erreur lors de la récupération des états :", error);
    res.status(500).json({ message: "Erreur interne", error: error.message });
  }
});

module.exports = router;
