// logic/dht11.logic.js

function logicDht11(temperature, humidite) {
    let action = "";
    let etat = true;
    let message_detaille = "";
    let zone = "Chambre";

    // Gestion température
    if (temperature > 28) {
        action = "Température élevée";
        etat = true;
        message_detaille = "Attention, température trop haute.";
    } else if (temperature < 15) {
        action = "Température basse";
        etat = true;
        message_detaille = "Attention, température trop basse.";
    } else {
        action = "Température confortable";
        message_detaille = "Température dans la plage confortable.";
    }

    // Gestion humidité
    if (humidite > 70) {
        if (!etat) {
            action = etat ? `${action} et Humidité élevée` : "Humidité élevée";
            message_detaille += etat 
                ? " Humidité également très élevée." 
                : "Humidité trop élevée, risque de condensation.";
        } else {
            action += " et Humidité élevée";
            message_detaille += " Humidité également très élevée.";
        }
        etat = true;
    } else if (humidite < 30) {
        if (!etat) {
            action = etat ? `${action} et Humidité basse` : "Humidité basse";
            message_detaille += etat 
                ? " Humidité également très basse." 
                : "Humidité trop basse, air sec.";
        } else {
            action += " et Humidité basse";
            message_detaille += " Humidité également très basse.";
        }
        etat = true;
    }

    return {
        temperature,
        humidite,
        action,
        etat,
        zone,
        message_detaille,
        datetime: new Date()
    };
}

module.exports = { logicDht11 };