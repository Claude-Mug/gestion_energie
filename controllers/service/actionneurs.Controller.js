const Actionneurs = require('../../models/actionneurs'); 
const { logicActionneurs } = require('../../controllers/logic/actionneurs.logic');
const { Op } = require('sequelize'); 

// La fonction findOrCreateActionneursRecord est supprimée car elle dépendait de 'identifier'.
// La logique de création du premier enregistrement est intégrée dans changeLastEtat.


const getAllActionneurs = async (req, res) => {
    try {
        console.log("--- Début getAllActionneurs ---");
        const data = await Actionneurs.findAll({ order: [['id', 'DESC']] }); // Ordonner pour voir les plus récents en premier
        console.log(`getAllActionneurs: Nombre total d'enregistrements trouvés: ${data.length}`);
        if (data.length > 0) {
            console.log("getAllActionneurs: Premier enregistrement (le plus récent):", data[0].toJSON());
        }
        console.log("--- Fin getAllActionneurs ---");
        res.json(data);
    } catch (err) {
        console.error("Erreur lors de la récupération de tous les actionneurs:", err);
        res.status(500).json({ error: err.message });
    }
};

const getActionneursById = async (req, res) => {
    try {
        console.log(`--- Début getActionneursById pour ID: ${req.params.id} ---`);
        const record = await Actionneurs.findByPk(req.params.id);
        if (!record) {
            console.log(`getActionneursById: Enregistrement avec ID ${req.params.id} non trouvé.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        console.log(`getActionneursById: Enregistrement avec ID ${req.params.id} trouvé:`, record.toJSON());
        console.log("--- Fin getActionneursById ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'actionneur par ID:", err);
        res.status(500).json({ error: err.message });
    }
};

const createActionneurs = async (req, res) => {
    try {
        console.log("--- Début createActionneurs ---");
        console.log("createActionneurs: Corps de la requête reçu:", req.body);
        // Assurez-vous que req.body contient toutes les valeurs pour les champs non-nullables
        const newRecord = await Actionneurs.create(req.body);
        console.log("createActionneurs: Enregistrement créé:", newRecord.toJSON());
        console.log("--- Fin createActionneurs ---");
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Erreur lors de la création de l'actionneur:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const updateActionneurs = async (req, res) => {
    try {
        console.log(`--- Début updateActionneurs pour ID: ${req.params.id} ---`);
        console.log(`updateActionneurs: Corps de la requête:`, req.body);
        const record = await Actionneurs.findByPk(req.params.id);
        if (!record) {
            console.log(`updateActionneurs: Enregistrement avec ID ${req.params.id} non trouvé pour mise à jour.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body); 
        console.log("updateActionneurs: Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin updateActionneurs ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'actionneur:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteActionneurs = async (req, res) => {
    try {
        console.log(`--- Début deleteActionneurs pour ID: ${req.params.id} ---`);
        const record = await Actionneurs.findByPk(req.params.id);
        if (!record) {
            console.log(`deleteActionneurs: Enregistrement avec ID ${req.params.id} non trouvé pour suppression.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.destroy();
        console.log(`deleteActionneurs: Enregistrement avec ID ${req.params.id} supprimé.`);
        console.log("--- Fin deleteActionneurs ---");
        res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'actionneur:", err);
        res.status(500).json({ error: err.message });
    }
};

const getData = async (req, res) => {
    try {
        console.log("--- Début getData (Actionneurs) ---");
        console.log("getData (Actionneurs): Corps de la requête reçu:", req.body);
        const formatted = logicActionneurs(req.body); // Assurez-vous que logicActionneurs est pertinent ici
        const record = await Actionneurs.create(formatted);
        console.log("getData (Actionneurs): Enregistrement créé:", record.toJSON());
        console.log("--- Fin getData (Actionneurs) ---");
        res.status(201).json(record);
    } catch (err) {
        console.error("Erreur dans getData pour actionneurs:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const changeEtat = async (req, res) => {
    try {
        console.log(`--- Début changeEtat (ID) pour ID: ${req.params.id} ---`);
        console.log(`changeEtat (ID): Corps de la requête:`, req.body);
        const record = await Actionneurs.findByPk(req.params.id);
        if (!record) {
            console.log(`changeEtat (ID): Enregistrement avec ID ${req.params.id} non trouvé pour changement d'état.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body); 
        console.log("changeEtat (ID): Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin changeEtat (ID) ---");
        res.json({ message: "État(s) modifié(s)", record });
    } catch (err) {
        console.error("Erreur lors du changement d'état par ID:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

/**
 * Récupère l'état d'un actionneur spécifique à partir du dernier snapshot.
 * Attend un paramètre de requête 'type' (ex: /etat?type=led_lr).
 */
const getLastEtat = async (req, res) => {
    try {
        console.log('--- Début getLastEtat (Actionneurs - Snapshots) ---');
        const { type } = req.query || {}; // Ex: 'led_lr', 'moteur'

        if (!type) {
            console.error("getLastEtat (Actionneurs): Le paramètre 'type' est manquant dans la requête.");
            return res.status(400).json({ message: 'Le paramètre "type" est requis pour récupérer l\'état d\'un actionneur spécifique.' });
        }

        // Trouver le dernier enregistrement (snapshot) par ID décroissant
        let lastSnapshot = await Actionneurs.findOne({ 
            order: [['id', 'DESC']] 
        });
        console.log('getLastEtat (Actionneurs): Dernier snapshot trouvé:', lastSnapshot ? lastSnapshot.toJSON() : 'null (aucun trouvé)');

        if (!lastSnapshot) {
            // Si aucun snapshot n'existe, renvoyer l'état par défaut (false)
            console.log('getLastEtat (Actionneurs): Aucun snapshot trouvé, renvoi de l\'état par défaut.');
            return res.status(200).json({ etat: false, message: 'Aucun enregistrement d\'actionneur trouvé, état initialisé à inactif.' });
        }
        
        // CORRECTION ICI: Convertir l'instance Sequelize en un plain object avant de vérifier la propriété
        const plainSnapshot = lastSnapshot.toJSON();
        
        // Vérifie si le type demandé est un champ valide dans le modèle Actionneurs
        if (plainSnapshot.hasOwnProperty(type)) { // Utilise plainSnapshot
            console.log(`getLastEtat (Actionneurs): État de ${type} trouvé:`, plainSnapshot[type]); // Utilise plainSnapshot
            res.json({ etat: plainSnapshot[type] }); // Renvoie la valeur booléenne
        } else {
            console.error(`getLastEtat (Actionneurs): Type d'actionneur '${type}' non reconnu.`);
            res.status(400).json({ message: `Type d'actionneur '${type}' non reconnu.` });
        }

    } catch (err) {
        console.error("Echec lors de la récupération du dernier état de l'actionneur par type :", err);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'état de l'actionneur." });
    }
};

/**
 * Met à jour l'état d'un actionneur spécifique en créant un nouveau snapshot.
 * Attend 'type' (ex: 'led_lr') et 'etat' (0 ou 1) dans le corps de la requête.
 */
const changeLastEtat = async (req, res) => {
    try {
        console.log('--- Début changeLastEtat (Actionneurs - Snapshots) ---');
        console.log('changeLastEtat (Actionneurs): Corps de la requête reçu:', req.body);
        const { type, etat } = req.body; // Ex: { type: 'led_lr', etat: 1 }

        if (!type || (etat === undefined || etat === null)) {
            console.error("changeLastEtat (Actionneurs): Paramètres 'type' ou 'etat' manquants.");
            return res.status(400).json({ message: 'Les paramètres "type" et "etat" sont requis pour changer l\'état.' });
        }

        // Trouver le dernier enregistrement (snapshot) existant
        let lastSnapshot = await Actionneurs.findOne({ 
            order: [['id', 'DESC']] 
        });
        console.log('changeLastEtat (Actionneurs): Dernier snapshot existant:', lastSnapshot ? lastSnapshot.toJSON() : 'null (aucun trouvé)');

        let newSnapshotData = {};

        if (lastSnapshot) {
            // Si un snapshot existe, copier toutes ses propriétés pour le nouveau snapshot
            newSnapshotData = lastSnapshot.toJSON();
            // Supprimer l'ID pour que Sequelize crée un nouvel enregistrement
            delete newSnapshotData.id; 
            // Mettre à jour le datetime pour le nouveau snapshot
            newSnapshotData.datetime = new Date();
        } else {
            // Si aucun snapshot n'existe, initialiser toutes les propriétés avec des valeurs par défaut
            newSnapshotData = {
                led_lr: false,
                led_lb: false,
                led_lw: false,
                led_lj: false,
                moteur: false,
                buzzer: false, // Assurez-vous que ce champ existe dans votre modèle
                action: 'Initialisation',
                zone: 'System',
                datetime: new Date()
            };
        }

        // Vérifie si le type demandé est un champ valide dans le modèle Actionneurs
        if (newSnapshotData.hasOwnProperty(type)) {
            // Mettre à jour l'état du champ spécifique dans le nouveau snapshot
            newSnapshotData[type] = Boolean(etat); // Convertit 0/1 en false/true
            newSnapshotData.action = `Changement ${type}`; // Mettre à jour l'action pour le log
            newSnapshotData.zone = 'Dashboard'; // Mettre à jour la zone

            // Créer le nouveau snapshot
            const newRecord = await Actionneurs.create(newSnapshotData);
            console.log('changeLastEtat (Actionneurs): Nouveau snapshot créé:', newRecord.toJSON());
            console.log('--- Fin changeLastEtat (Actionneurs) ---');
            res.json({ message: `État de ${type} mis à jour à ${newRecord[type]}`, record: newRecord });
        } else {
            console.error(`changeLastEtat (Actionneurs): Type d'actionneur '${type}' non reconnu.`);
            res.status(400).json({ message: `Type d'actionneur '${type}' non reconnu.` });
        }

    } catch (err) {
        console.error("Erreur lors du changement d'état de l'actionneur par type :", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: "Erreur serveur lors du changement d'état de l'actionneur." });
    }
};

const getAllLastEtats = async (req, res) => {
    try {
        console.log('--- Début getAllLastEtats (Tous les actionneurs) ---');
        
        // Récupère le dernier snapshot global
        const lastSnapshot = await Actionneurs.findOne({ 
            order: [['id', 'DESC']] 
        });

        if (!lastSnapshot) {
            // Aucun enregistrement trouvé
            return res.status(200).json({
                led_lr: false,
                led_lb: false,
                led_lw: false,
                led_lj: false,
                moteur: false,
                buzzer: false
            });
        }

        // Convertir en objet simple
        const plainSnapshot = lastSnapshot.toJSON();
        
        // Structure de réponse
        const response = {
            led_lr: plainSnapshot.led_lr,
            led_lb: plainSnapshot.led_lb,
            led_lw: plainSnapshot.led_lw,
            led_lj: plainSnapshot.led_lj,
            moteur: plainSnapshot.moteur,
            buzzer: plainSnapshot.buzzer
        };

        console.log('getAllLastEtats: Derniers états:', response);
        res.status(200).json(response);

    } catch (err) {
        console.error("Erreur dans getAllLastEtats:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Exportation de toutes les fonctions du contrôleur
module.exports = {
    getAllActionneurs,
    getActionneursById,
    createActionneurs,
    updateActionneurs,
    deleteActionneurs,
    getData,
    changeEtat,
    changeLastEtat, 
    getLastEtat,
    getAllLastEtats    
};
