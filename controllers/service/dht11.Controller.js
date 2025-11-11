const { Dht11 } = require('../../models');
const { logicDht11 } = require('../../controllers/logic/dht11.logic');
const { Op } = require('sequelize'); // Import Op pour les requêtes complexes si nécessaire

const getAllDht11 = async (req, res) => {
    try {
        console.log("--- Début getAllDht11 ---");
        const data = await Dht11.findAll();
        console.log(`getAllDht11: Nombre total d'enregistrements trouvés: ${data.length}`);
        if (data.length > 0) {
            console.log("getAllDht11: Premier enregistrement:", data[0].toJSON());
        }
        console.log("--- Fin getAllDht11 ---");
        res.json(data);
    } catch (err) {
        console.error("Erreur lors de la récupération de tous les enregistrements Dht11:", err);
        res.status(500).json({ error: err.message });
    }
};

const getDht11ById = async (req, res) => {
    try {
        console.log(`--- Début getDht11ById pour ID: ${req.params.id} ---`);
        const record = await Dht11.findByPk(req.params.id);
        if (!record) {
            console.log(`getDht11ById: Enregistrement avec ID ${req.params.id} non trouvé.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        console.log(`getDht11ById: Enregistrement avec ID ${req.params.id} trouvé:`, record.toJSON());
        console.log("--- Fin getDht11ById ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'enregistrement Dht11 par ID:", err);
        res.status(500).json({ error: err.message });
    }
};

const createDht11 = async (req, res) => {
    try {
        console.log("--- Début createDht11 ---");
        console.log("createDht11: Corps de la requête reçu:", req.body);
        const newRecord = await Dht11.create(req.body);
        console.log("createDht11: Enregistrement créé:", newRecord.toJSON());
        console.log("--- Fin createDht11 ---");
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Erreur lors de la création de l'enregistrement Dht11:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const updateDht11 = async (req, res) => {
    try {
        console.log(`--- Début updateDht11 pour ID: ${req.params.id} ---`);
        console.log(`updateDht11: Corps de la requête:`, req.body);
        const record = await Dht11.findByPk(req.params.id);
        if (!record) {
            console.log(`updateDht11: Enregistrement avec ID ${req.params.id} non trouvé pour mise à jour.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body);
        console.log("updateDht11: Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin updateDht11 ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'enregistrement Dht11:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteDht11 = async (req, res) => {
    try {
        console.log(`--- Début deleteDht11 pour ID: ${req.params.id} ---`);
        const record = await Dht11.findByPk(req.params.id);
        if (!record) {
            console.log(`deleteDht11: Enregistrement avec ID ${req.params.id} non trouvé pour suppression.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.destroy();
        console.log(`deleteDht11: Enregistrement avec ID ${req.params.id} supprimé.`);
        console.log("--- Fin deleteDht11 ---");
        res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'enregistrement Dht11:", err);
        res.status(500).json({ error: err.message });
    }
};

const getData = async (req, res) => {
    try {
        console.log("--- Début getData (Dht11) ---");
        console.log("getData (Dht11): Corps de la requête reçu:", req.body);
        const { temperature, humidite } = req.body;
        const formatted = logicDht11(temperature, humidite); // Assurez-vous que logicDht11 retourne un objet complet
        const record = await Dht11.create(formatted);
        console.log("getData (Dht11): Enregistrement créé:", record.toJSON());
        console.log("--- Fin getData (Dht11) ---");
        res.status(201).json(record);
    } catch (err) {
        console.error("Erreur dans getData pour Dht11:", err);
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
        const record = await Dht11.findByPk(req.params.id);
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
        console.error("Erreur lors du changement d'état par ID pour Dht11:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const changeLastEtat = async (req, res) => {
  try {
    console.log('--- Début changeLastEtat (Dht11) ---');
    console.log('changeLastEtat (Dht11): Corps de la requête reçu:', req.body);
    const { etat } = req.body;

    if (etat === undefined || etat === null) {
        console.error("changeLastEtat (Dht11): 'etat' est manquant ou null dans le corps de la requête.");
        return res.status(400).json({ message: "Le champ 'etat' est requis dans le corps de la requête." });
    }

    // Utiliser 'id' pour l'ordonnancement pour obtenir le dernier enregistrement
    let dernier = await Dht11.findOne({ order: [['id', 'DESC']] }); 
    console.log('changeLastEtat (Dht11): Résultat de la recherche du dernier enregistrement (par ID DESC):', dernier ? dernier.toJSON() : 'null (aucun trouvé)');

    if (!dernier) {
      console.log('changeLastEtat (Dht11): Aucun enregistrement existant trouvé, tentative de création d\'un nouvel enregistrement.');
      // TRÈS IMPORTANT: Assurez-vous que TOUS les champs non-nullables de votre modèle Dht11
      // ont une valeur par défaut ici. Adaptez selon la structure réelle de votre modèle Dht11.
      dernier = await Dht11.create({ 
          etat: Boolean(etat),
          temperature: 0, // Exemple: Valeur par défaut pour temperature
          humidite: 0,    // Exemple: Valeur par défaut pour humidite
          action: 'Initialisation', 
          zone: 'N/A',
          datetime: new Date() // Assurez-vous que datetime est géré si non-nullable
      });
      console.log('changeLastEtat (Dht11): Nouvel enregistrement créé:', dernier.toJSON());
      console.log('--- Fin changeLastEtat (Dht11 - création) ---');
      return res.status(201).json({ message: 'Premier enregistrement créé avec l\'état fourni.', record: dernier });
    }

    console.log('changeLastEtat (Dht11): Enregistrement existant trouvé, mise à jour de l\'état.');
    dernier.etat = Boolean(etat);
    await dernier.save();
    console.log('changeLastEtat (Dht11): Enregistrement mis à jour:', dernier.toJSON());
    console.log('--- Fin changeLastEtat (Dht11 - mise à jour) ---');

    res.json({ message: `Dernier état mis à jour à ${dernier.etat}`, record: dernier });
  } catch (err) {
    console.error("Erreur lors du changement du dernier état pour Dht11:", err);
    if (err.name === 'SequelizeValidationError' && err.errors) {
        err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
    }
    res.status(500).json({ error: "Erreur serveur lors du changement d'état." });
  }
};

const getLastEtat = async (req, res) => {
  try {
    console.log('--- Début getLastEtat (Dht11) ---');
    console.log('getLastEtat (Dht11): Tentative de récupération du dernier état par ID (DESC).');
    let last = await Dht11.findOne({ 
      order: [['id', 'DESC']] 
    });

    console.log('getLastEtat (Dht11): Résultat de la recherche par ID:', last ? last.toJSON() : 'null (aucun trouvé)'); 

    if (!last) {
      console.log('getLastEtat (Dht11): Aucun enregistrement trouvé, renvoi de l\'état par défaut.');
      console.log('--- Fin getLastEtat (Dht11 - aucun trouvé) ---');
      return res.status(200).json({ etat: false, message: 'Aucune donnée trouvée, état initialisé à inactif.' });
    }
    console.log('getLastEtat (Dht11): Dernier enregistrement trouvé, état:', last.etat);
    console.log('--- Fin getLastEtat (Dht11 - trouvé) ---');
    res.json({ etat: last.etat });
  } catch (err) {
    console.error("Erreur lors de la récupération du dernier état pour Dht11:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'état." });
  }
};

module.exports = {
    getAllDht11,
    getDht11ById,
    createDht11,
    updateDht11,
    deleteDht11,
    getData,
    changeEtat,
    changeLastEtat,
    getLastEtat
};
