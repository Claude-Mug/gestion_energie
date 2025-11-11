const { Ldr } = require('../../models');
const { logicLdr } = require('../../controllers/logic/ldr.logic');
const { Op } = require('sequelize'); // Import Op pour les requêtes complexes si nécessaire

const getAllLdr = async (req, res) => {
    try {
        console.log("--- Début getAllLdr ---");
        const data = await Ldr.findAll();
        console.log(`getAllLdr: Nombre total d'enregistrements trouvés: ${data.length}`);
        if (data.length > 0) {
            console.log("getAllLdr: Premier enregistrement:", data[0].toJSON());
        }
        console.log("--- Fin getAllLdr ---");
        res.json(data);
    } catch (err) {
        console.error("Erreur lors de la récupération de tous les enregistrements Ldr:", err);
        res.status(500).json({ error: err.message });
    }
};

const getLdrById = async (req, res) => {
    try {
        console.log(`--- Début getLdrById pour ID: ${req.params.id} ---`);
        const record = await Ldr.findByPk(req.params.id);
        if (!record) {
            console.log(`getLdrById: Enregistrement avec ID ${req.params.id} non trouvé.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        console.log(`getLdrById: Enregistrement avec ID ${req.params.id} trouvé:`, record.toJSON());
        console.log("--- Fin getLdrById ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'enregistrement Ldr par ID:", err);
        res.status(500).json({ error: err.message });
    }
};

const createLdr = async (req, res) => {
    try {
        console.log("--- Début createLdr ---");
        console.log("createLdr: Corps de la requête reçu:", req.body);
        const newRecord = await Ldr.create(req.body);
        console.log("createLdr: Enregistrement créé:", newRecord.toJSON());
        console.log("--- Fin createLdr ---");
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Erreur lors de la création de l'enregistrement Ldr:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const updateLdr = async (req, res) => {
    try {
        console.log(`--- Début updateLdr pour ID: ${req.params.id} ---`);
        console.log(`updateLdr: Corps de la requête:`, req.body);
        const record = await Ldr.findByPk(req.params.id);
        if (!record) {
            console.log(`updateLdr: Enregistrement avec ID ${req.params.id} non trouvé pour mise à jour.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body);
        console.log("updateLdr: Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin updateLdr ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'enregistrement Ldr:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const deleteLdr = async (req, res) => {
    try {
        console.log(`--- Début deleteLdr pour ID: ${req.params.id} ---`);
        const record = await Ldr.findByPk(req.params.id);
        if (!record) {
            console.log(`deleteLdr: Enregistrement avec ID ${req.params.id} non trouvé pour suppression.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.destroy();
        console.log(`deleteLdr: Enregistrement avec ID ${req.params.id} supprimé.`);
        console.log("--- Fin deleteLdr ---");
        res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'enregistrement Ldr:", err);
        res.status(500).json({ error: err.message });
    }
};

const getData = async (req, res) => {
    try {
        console.log("--- Début getData (Ldr) ---");
        console.log("getData (Ldr): Corps de la requête reçu:", req.body);
        const formatted = logicLdr(req.body.luminosite_niveau); // Adaptez si logicLdr prend d'autres paramètres ou retourne un objet complet
        const record = await Ldr.create(formatted);
        console.log("getData (Ldr): Enregistrement créé:", record.toJSON());
        console.log("--- Fin getData (Ldr) ---");
        res.status(201).json(record);
    } catch (err) {
        console.error("Erreur dans getData pour Ldr:", err);
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
        const record = await Ldr.findByPk(req.params.id);
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
        console.error("Erreur lors du changement d'état par ID pour Ldr:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const changeLastEtat = async (req, res) => {
  try {
    console.log('--- Début changeLastEtat (Ldr) ---');
    console.log('changeLastEtat (Ldr): Corps de la requête reçu:', req.body);
    const { etat } = req.body;

    if (etat === undefined || etat === null) {
        console.error("changeLastEtat (Ldr): 'etat' est manquant ou null dans le corps de la requête.");
        return res.status(400).json({ message: "Le champ 'etat' est requis dans le corps de la requête." });
    }

    // Utiliser 'id' pour l'ordonnancement pour obtenir le dernier enregistrement
    let dernier = await Ldr.findOne({ order: [['id', 'DESC']] }); 
    console.log('changeLastEtat (Ldr): Résultat de la recherche du dernier enregistrement (par ID DESC):', dernier ? dernier.toJSON() : 'null (aucun trouvé)');

    if (!dernier) {
      console.log('changeLastEtat (Ldr): Aucun enregistrement existant trouvé, tentative de création d\'un nouvel enregistrement.');
      // TRÈS IMPORTANT: Assurez-vous que TOUS les champs non-nullables de votre modèle Ldr
      // ont une valeur par défaut ici. Adaptez selon la structure réelle de votre modèle Ldr.
      dernier = await Ldr.create({ 
          etat: Boolean(etat),
          luminosite_niveau: 0, // Exemple: Valeur par défaut pour luminosite_niveau
          action: 'Initialisation', 
          zone: 'N/A',
          datetime: new Date() // Assurez-vous que datetime est géré si non-nullable
      });
      console.log('changeLastEtat (Ldr): Nouvel enregistrement créé:', dernier.toJSON());
      console.log('--- Fin changeLastEtat (Ldr - création) ---');
      return res.status(201).json({ message: 'Premier enregistrement créé avec l\'état fourni.', record: dernier });
    }

    console.log('changeLastEtat (Ldr): Enregistrement existant trouvé, mise à jour de l\'état.');
    dernier.etat = Boolean(etat);
    await dernier.save();
    console.log('changeLastEtat (Ldr): Enregistrement mis à jour:', dernier.toJSON());
    console.log('--- Fin changeLastEtat (Ldr - mise à jour) ---');

    res.json({ message: `Dernier état mis à jour à ${dernier.etat}`, record: dernier });
  } catch (err) {
    console.error("Erreur lors du changement du dernier état pour Ldr:", err);
    if (err.name === 'SequelizeValidationError' && err.errors) {
        err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
    }
    res.status(500).json({ error: "Erreur serveur lors du changement d'état." });
  }
};

const getLastEtat = async (req, res) => {
  try {
    console.log('--- Début getLastEtat (Ldr) ---');
    console.log('getLastEtat (Ldr): Tentative de récupération du dernier état par ID (DESC).');
    let last = await Ldr.findOne({ 
      order: [['id', 'DESC']] 
    });

    console.log('getLastEtat (Ldr): Résultat de la recherche par ID:', last ? last.toJSON() : 'null (aucun trouvé)'); 

    if (!last) {
      console.log('getLastEtat (Ldr): Aucun enregistrement trouvé, renvoi de l\'état par défaut.');
      console.log('--- Fin getLastEtat (Ldr - aucun trouvé) ---');
      return res.status(200).json({ etat: false, message: 'Aucune donnée trouvée, état initialisé à inactif.' });
    }
    console.log('getLastEtat (Ldr): Dernier enregistrement trouvé, état:', last.etat);
    console.log('--- Fin getLastEtat (Ldr - trouvé) ---');
    res.json({ etat: last.etat });
  } catch (err) {
    console.error("Erreur lors de la récupération du dernier état pour Ldr:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'état." });
  }
};

module.exports = {
    getAllLdr,
    getLdrById,
    createLdr,
    updateLdr,
    deleteLdr,
    getData,
    changeEtat,
    changeLastEtat,
    getLastEtat
};
