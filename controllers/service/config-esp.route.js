const express = require('express');
const router = express.Router();
const {
    getLastEtat: getActionneursState
} = require('../../controllers/service/actionneurs.Controller');
const {
    getLastRecord: getPirState
} = require('../../controllers/service/pir.Controller');
const {
    getLastRecord: getLdrState
} = require('../../controllers/service/ldr.Controller');
const {
    getLastRecord: getDht11State
} = require('../../controllers/service/dht11.Controller');
const {
    getLastRecord: getUltrasonicState
} = require('../../controllers/service/ultrasonic.Controller');

// Fonction utilitaire pour récupérer l'état d'un module
async function getModuleEnabledState(moduleType, getStateFunction, param = null) {
    try {
        console.log(`--- Début getModuleEnabledState (${moduleType}) ---`);
        
        // Créer des objets req et res simulés
        const req = param ? { query: { type: param } } : {};
        const res = {
            json: (data) => data,
            status: () => ({ json: (err) => { throw new Error(JSON.stringify(err)); } })
        };

        const result = await getStateFunction(req, res);
        console.log(`--- Fin getModuleEnabledState (${moduleType} - ${result.etat ? 'Activé' : 'Désactivé'}) ---`);
        return result.etat;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'état du module ${moduleType}:`, error);
        return false;
    }
}

// Route principale pour la configuration ESP
router.get('/config-esp', async (req, res) => {
    try {
        console.log('[ESP CONFIG] Début de la génération de la configuration...');
        
        // Récupération asynchrone des états
        const [
            pirEnabled,
            ultrasonicEnabled,
            dht11Enabled,
            ldrEnabled,
            ledLRenabled,
            ledLBenabled,
            ledLWenabled,
            ledLJenabled,
            moteurEnabled
        ] = await Promise.all([
            getModuleEnabledState('PIR', getPirState),
            getModuleEnabledState('Ultrasonic', getUltrasonicState),
            getModuleEnabledState('DHT11', getDht11State),
            getModuleEnabledState('LDR', getLdrState),
            getModuleEnabledState('Actionneur LED LR', getActionneursState, 'led_lr'),
            getModuleEnabledState('Actionneur LED LB', getActionneursState, 'led_lb'),
            getModuleEnabledState('Actionneur LED LW', getActionneursState, 'led_lw'),
            getModuleEnabledState('Actionneur LED LJ', getActionneursState, 'led_lj'),
            getModuleEnabledState('Actionneur Moteur', getActionneursState, 'moteur')
        ]);

        // Construction de la configuration
        const config = {
            modules: {
                pir: pirEnabled ? 1 : 0,
                ultrasonic: ultrasonicEnabled ? 1 : 0,
                dht11: dht11Enabled ? 1 : 0,
                ldr: ldrEnabled ? 1 : 0,
                actionneurs: {
                    led_lr: ledLRenabled ? 1 : 0,
                    led_lb: ledLBenabled ? 1 : 0,
                    led_lw: ledLWenabled ? 1 : 0,
                    led_lj: ledLJenabled ? 1 : 0,
                    moteur: moteurEnabled ? 1 : 0
                }
            },
            timestamp: new Date().toISOString()
        };

        console.log('[ESP CONFIG] État des modules:');
        console.log(`- PIR: ${pirEnabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- Ultrasonic: ${ultrasonicEnabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- DHT11: ${dht11Enabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- LDR: ${ldrEnabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- LED LR: ${ledLRenabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- LED LB: ${ledLBenabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- LED LW: ${ledLWenabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- LED LJ: ${ledLJenabled ? 'Activé' : 'Désactivé'}`);
        console.log(`- Moteur: ${moteurEnabled ? 'Activé' : 'Désactivé'}`);
        
        console.log('[ESP CONFIG] Envoi de la configuration JSON à l\'ESP.');
        res.json(config);
    } catch (error) {
        console.error('[ESP CONFIG] Erreur lors de la génération de la configuration:', error);
        res.status(500).json({ 
            error: 'Erreur serveur',
            details: error.message 
        });
    }
});

module.exports = router;