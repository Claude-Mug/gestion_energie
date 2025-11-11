const { Pir } = require('../../models');
const { logicPir } = require('../../controllers/logic/pir.logic');
const { Op } = require('sequelize'); // Import Op pour les requêtes complexes si nécessaire

const getAllPir = async (req, res) => {
    try {
        console.log("--- Début getAllPir ---");
        const data = await Pir.findAll();
        console.log(`getAllPir: Nombre total d'enregistrements trouvés: ${data.length}`);
        if (data.length > 0) {
            console.log("getAllPir: Premier enregistrement:", data[0].toJSON());
        }
        console.log("--- Fin getAllPir ---");
        res.json(data);
    } catch (err) {
        console.error("Erreur lors de la récupération de tous les enregistrements Pir:", err);
        res.status(500).json({ error: err.message });
    }
};

const getPirById = async (req, res) => {
    try {
        console.log(`--- Début getPirById pour ID: ${req.params.id} ---`);
        const record = await Pir.findByPk(req.params.id);
        if (!record) {
            console.log(`getPirById: Enregistrement avec ID ${req.params.id} non trouvé.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        console.log(`getPirById: Enregistrement avec ID ${req.params.id} trouvé:`, record.toJSON());
        console.log("--- Fin getPirById ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'enregistrement Pir par ID:", err);
        res.status(500).json({ error: err.message });
    }
};

const createPir = async (req, res) => {
    try {
        console.log("--- Début createPir ---");
        console.log("createPir: Corps de la requête reçu:", req.body);
        const newRecord = await Pir.create(req.body);
        console.log("createPir: Enregistrement créé:", newRecord.toJSON());
        console.log("--- Fin createPir ---");
        res.status(201).json(newRecord);
    } catch (err) {
        console.error("Erreur lors de la création de l'enregistrement Pir:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const updatePir = async (req, res) => {
    try {
        console.log(`--- Début updatePir pour ID: ${req.params.id} ---`);
        console.log(`updatePir: Corps de la requête:`, req.body);
        const record = await Pir.findByPk(req.params.id);
        if (!record) {
            console.log(`updatePir: Enregistrement avec ID ${req.params.id} non trouvé pour mise à jour.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.update(req.body);
        console.log("updatePir: Enregistrement mis à jour:", record.toJSON());
        console.log("--- Fin updatePir ---");
        res.json(record);
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'enregistrement Pir:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const deletePir = async (req, res) => {
    try {
        console.log(`--- Début deletePir pour ID: ${req.params.id} ---`);
        const record = await Pir.findByPk(req.params.id);
        if (!record) {
            console.log(`deletePir: Enregistrement avec ID ${req.params.id} non trouvé pour suppression.`);
            return res.status(404).json({ message: 'Enregistrement non trouvé' });
        }
        await record.destroy();
        console.log(`deletePir: Enregistrement avec ID ${req.params.id} supprimé.`);
        console.log("--- Fin deletePir ---");
        res.json({ message: 'Enregistrement supprimé' });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'enregistrement Pir:", err);
        res.status(500).json({ error: err.message });
    }
};

const getData = async (req, res) => {
    try {
        console.log("--- Début getData (Pir) ---");
        console.log("getData (Pir): Corps de la requête reçu:", req.body);
        const formatted = logicPir(req.body.etat_mouvement); // Adaptez si logicPir prend d'autres paramètres ou retourne un objet complet
        const record = await Pir.create(formatted);
        console.log("getData (Pir): Enregistrement créé:", record.toJSON());
        console.log("--- Fin getData (Pir) ---");
        res.status(201).json(record);
    } catch (err) {
        console.error("Erreur dans getData pour Pir:", err);
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
        const record = await Pir.findByPk(req.params.id);
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
        console.error("Erreur lors du changement d'état par ID pour Pir:", err);
        if (err.name === 'SequelizeValidationError' && err.errors) {
            err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
        }
        res.status(500).json({ error: err.message });
    }
};

const changeLastEtat = async (req, res) => {
  try {
    console.log('--- Début changeLastEtat (Pir) ---');
    console.log('changeLastEtat (Pir): Corps de la requête reçu:', req.body);
    const { etat } = req.body;

    if (etat === undefined || etat === null) {
        console.error("changeLastEtat (Pir): 'etat' est manquant ou null dans le corps de la requête.");
        return res.status(400).json({ message: "Le champ 'etat' est requis dans le corps de la requête." });
    }

    // Utiliser 'id' pour l'ordonnancement pour obtenir le dernier enregistrement
    let dernier = await Pir.findOne({ order: [['id', 'DESC']] }); 
    console.log('changeLastEtat (Pir): Résultat de la recherche du dernier enregistrement (par ID DESC):', dernier ? dernier.toJSON() : 'null (aucun trouvé)');

    if (!dernier) {
      console.log('changeLastEtat (Pir): Aucun enregistrement existant trouvé, tentative de création d\'un nouvel enregistrement.');
      // TRÈS IMPORTANT: Assurez-vous que TOUS les champs non-nullables de votre modèle Pir
      // ont une valeur par défaut ici. Adaptez selon la structure réelle de votre modèle Pir.
      dernier = await Pir.create({ 
          etat: Boolean(etat),
          etat_mouvement: false, // Exemple: Valeur par défaut pour etat_mouvement
          action: 'Initialisation', 
          zone: 'N/A',
          datetime: new Date() // Assurez-vous que datetime est géré si non-nullable
      });
      console.log('changeLastEtat (Pir): Nouvel enregistrement créé:', dernier.toJSON());
      console.log('--- Fin changeLastEtat (Pir - création) ---');
      return res.status(201).json({ message: 'Premier enregistrement créé avec l\'état fourni.', record: dernier });
    }

    console.log('changeLastEtat (Pir): Enregistrement existant trouvé, mise à jour de l\'état.');
    dernier.etat = Boolean(etat);
    await dernier.save();
    console.log('changeLastEtat (Pir): Enregistrement mis à jour:', dernier.toJSON());
    console.log('--- Fin changeLastEtat (Pir - mise à jour) ---');

    res.json({ message: `Dernier état mis à jour à ${dernier.etat}`, record: dernier });
  } catch (err) {
    console.error("Erreur lors du changement du dernier état pour Pir:", err);
    if (err.name === 'SequelizeValidationError' && err.errors) {
        err.errors.forEach(e => console.error(`Validation Error: ${e.message} (Champ: ${e.path}, Valeur: ${e.value})`));
    }
    res.status(500).json({ error: "Erreur serveur lors du changement d'état." });
  }
};

const getLastEtat = async (req, res) => {
  try {
    console.log('--- Début getLastEtat (Pir) ---');
    console.log('getLastEtat (Pir): Tentative de récupération du dernier état par ID (DESC).');
    let last = await Pir.findOne({ 
      order: [['id', 'DESC']] 
    });

    console.log('getLastEtat (Pir): Résultat de la recherche par ID:', last ? last.toJSON() : 'null (aucun trouvé)'); 

    if (!last) {
      console.log('getLastEtat (Pir): Aucun enregistrement trouvé, renvoi de l\'état par défaut.');
      console.log('--- Fin getLastEtat (Pir - aucun trouvé) ---');
      return res.status(200).json({ etat: false, message: 'Aucune donnée trouvée, état initialisé à inactif.' });
    }
    console.log('getLastEtat (Pir): Dernier enregistrement trouvé, état:', last.etat);
    console.log('--- Fin getLastEtat (Pir - trouvé) ---');
    res.json({ etat: last.etat });
  } catch (err) {
    console.error("Erreur lors de la récupération du dernier état pour Pir:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'état." });
  }
};

module.exports = {
    getAllPir,
    getPirById,
    createPir,
    updatePir,
    deletePir,
    getData,
    changeEtat,
    changeLastEtat,
    getLastEtat
};
