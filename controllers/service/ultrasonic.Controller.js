const { Ultrasonic } = require('../../models');
const { logicultrasonic } = require('../../controllers/logic/ultrasonic.logic');
const { Op } = require('sequelize'); 

const getAllUltrasonic = async (req, res) => {
    try {
        console.log("--- Début getAllUltrasonic ---");
        const data = await Ultrasonic.findAll();
        console.log(`getAllUltrasonic: Nombre total d'enregistrements trouvés: ${data.length}`);
        if (data.length > 0) {
            console.log("getAllUltrasonic: Premier enregistrement:", data[0].toJSON());
            console.log("getAllUltrasonic: Dernier enregistrement (selon l'ordre de la DB, pas forcément l'ID le plus grand):", data[data.length - 1].toJSON());
        }
        console.log("--- Fin getAllUltrasonic ---");
        res.json(data);
    } catch (err) {
        console.error("Erreur lors de la récupération de tous les enregistrements Ultrasonic:", err);
        res.status(500).json({ error: err.message });
    }
};

const getUltrasonicById = async (req, res) => {
    try {
        console.log(`--- Début getUltrasonicById pour ID: ${req.params.id} ---`);
        const record = await Ultrasonic.findByPk(req.params.id);
        if (!record) {
            console.log(`getUltrasonicById: Enregistrement avec ID ${req.params.id} non trouvé.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        console.log(`getUltrasonicById: Enregistrement avec ID ${req.params.id} trouvé:`, record.toJSON());
        console.log("--- Fin getUltrasonicById ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'enregistrement Ultrasonic par ID:", err);
        res.status(500).json({ error: err.message });
    }
};

const createUltrasonic = async (req, res) => {
    try {
        console.log("--- Début createUltrasonic ---");
        console.log("createUltrasonic: Corps de la requête reçu:", req.body);
        const newRecord = await Ultrasonic.create(req.body);
        console.log("createUltrasonic: Enregistrement créé:", newRecord.toJSON());
        console.log("--- Fin createUltrasonic ---");
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Erreur lors de la création de l'enregistrement Ultrasonic:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const updateUltrasonic = async (req, res) => {
    try {
        console.log(`--- Début updateUltrasonic pour ID: ${req.params.id} ---`);
        console.log(`updateUltrasonic: Corps de la requête:`, req.body);
        const record = await Ultrasonic.findByPk(req.params.id);
        if (!record) {
            console.log(`updateUltrasonic: Enregistrement avec ID ${req.params.id} non trouvé pour mise à jour.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body);
        console.log("updateUltrasonic: Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin updateUltrasonic ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'enregistrement Ultrasonic:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteUltrasonic = async (req, res) => {
    try {
        console.log(`--- Début deleteUltrasonic pour ID: ${req.params.id} ---`);
        const record = await Ultrasonic.findByPk(req.params.id);
        if (!record) {
            console.log(`deleteUltrasonic: Enregistrement avec ID ${req.params.id} non trouvé pour suppression.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.destroy();
        console.log(`deleteUltrasonic: Enregistrement avec ID ${req.params.id} supprimé.`);
        console.log("--- Fin deleteUltrasonic ---");
        res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'enregistrement Ultrasonic:", err);
        res.status(500).json({ error: err.message });
    }
};  

const getData = async (req, res) => {
    try {
        console.log("--- Début getData (Ultrasonic) ---");
        console.log("getData (Ultrasonic): Corps de la requête reçu:", req.body);
        const formatted = logicultrasonic(req.body.distance_cm); 
        const record = await Ultrasonic.create(formatted);
        console.log("getData (Ultrasonic): Enregistrement créé:", record.toJSON());
        console.log("--- Fin getData (Ultrasonic) ---");
        res.status(201).json(record);
    } catch (err) {
        console.error("Erreur dans getData pour Ultrasonic:", err);
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
        const record = await Ultrasonic.findByPk(req.params.id);
        if (!record) {
            console.log(`changeEtat (ID): Enregistrement avec ID ${req.params.id} non trouvé pour changement d'état.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        record.etat = req.body.etat;
        await record.save();
        console.log("changeEtat (ID): Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin changeEtat (ID) ---");
        res.json({ message: `État mis à jour à ${record.etat}`, record });
    } catch (err) {
        console.error("Erreur lors du changement d'état par ID pour Ultrasonic:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const changeLastEtat = async (req, res) => {
  try {
    console.log('--- Début changeLastEtat ---');
    console.log('changeLastEtat: Corps de la requête reçu:', req.body);
    const { etat } = req.body;

    if (etat === undefined || etat === null) {
        console.error("changeLastEtat: 'etat' est manquant ou null dans le corps de la requête.");
        return res.status(400).json({ message: "Le champ 'etat' est requis dans le corps de la requête." });
    }

    let dernier = await Ultrasonic.findOne({ order: [['id', 'DESC']] }); 
    console.log('changeLastEtat: Résultat de la recherche du dernier enregistrement (par ID DESC):', dernier ? dernier.toJSON() : 'null (aucun trouvé)');

    if (!dernier) {
      console.log('changeLastEtat: Aucun enregistrement existant trouvé, tentative de création d\'un nouvel enregistrement.');
      dernier = await Ultrasonic.create({ 
          etat: Boolean(etat),
          distance_cm: 0,
          action: 'Initialisation', 
          zone: 'N/A',
          datetime: new Date() 
      });
      console.log('changeLastEtat: Nouvel enregistrement créé:', dernier.toJSON());
      console.log('--- Fin changeLastEtat (création) ---');
      return res.status(201).json({ message: 'Premier enregistrement créé avec l\'état fourni.', record: dernier });
    }

    console.log('changeLastEtat: Enregistrement existant trouvé, mise à jour de l\'état.');
    dernier.etat = Boolean(etat);
    await dernier.save();
    console.log('changeLastEtat: Enregistrement mis à jour:', dernier.toJSON());
    console.log('--- Fin changeLastEtat (mise à jour) ---');

    res.json({ message: `Dernier état mis à jour à ${dernier.etat}`, record: dernier });
  } catch (err) {
    console.error("Erreur lors du changement du dernier état pour Ultrasonic:", err);
    if (err.name === 'SequelizeValidationError' && err.errors) {
        err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
    }
    res.status(500).json({ error: "Erreur serveur lors du changement d'état." });
  }
};

const getLastEtat = async (req, res) => {
  try {
    console.log('--- Début getLastEtat ---');
    console.log('getLastEtat: Tentative de récupération du dernier état par ID (DESC).');
    let last = await Ultrasonic.findOne({ 
      order: [['id', 'DESC']] 
    });

    console.log('getLastEtat: Résultat de la recherche par ID:', last ? last.toJSON() : 'null (aucun trouvé)'); 

    if (!last) {
      console.log('getLastEtat: Aucun enregistrement trouvé, renvoi de l\'état par défaut.');
      console.log('--- Fin getLastEtat (aucun trouvé) ---');
      return res.status(200).json({ etat: false, message: 'Aucune donnée trouvée, état initialisé à inactif.' });
    }
    console.log('getLastEtat: Dernier enregistrement trouvé, état:', last.etat);
    console.log('--- Fin getLastEtat (trouvé) ---');
    res.json({ etat: last.etat });
  } catch (err) {
    console.error("Erreur lors de la récupération du dernier état pour Ultrasonic:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'état." });
  }
};

module.exports = {
    getAllUltrasonic,
    getUltrasonicById,
    createUltrasonic,
    updateUltrasonic,
    deleteUltrasonic,
    getData,
    changeEtat,
    changeLastEtat,
    getLastEtat
};
