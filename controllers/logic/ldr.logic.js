// logic/ldr.logic.js

function logicLdr(luminosite_niveau) {
    let action = "";
    let etat = true;
    let message_detaille = "";
    let zone = "Salon";

    // Seuil d'alerte seulement quand trop sombre
    if (luminosite_niveau < 100) {
        action = "Niveau lumière très faible";
        etat = true;
        message_detaille = "Zone très sombre, lumière nécessaire.";
    } else if (luminosite_niveau < 400) {
        action = "Niveau lumière faible";
        message_detaille = "Luminosité naturelle insuffisante.";
    } else {
        action = "Niveau lumière correct";
        message_detaille = luminosite_niveau < 700 
            ? "Luminosité correcte" 
            : "Zone bien éclairée";
    }

    return {
        luminosite_niveau,
        action,
        etat,
        zone,
        message_detaille,
        datetime: new Date()
    };
}

module.exports = { logicLdr };