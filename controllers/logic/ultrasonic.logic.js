// logic/ultrasonic.logic.js

function logicultrasonic(distance_cm, zone = "Media-box") {
    let action = "";
    let etat = true;
    let niveau_alerte = "";

    if (distance_cm < 10) {
        action = "Objet très proche";
        etat = true;
        niveau_alerte = "Critique";
    } else if (distance_cm < 30) {
        action = "Entrée principale";
        etat = true;
        niveau_alerte = "Alerte";
    } else if (distance_cm < 50) {
        action = "Objet détecté";
        etat = true;
        niveau_alerte = "Information";
    } else {
        action = "Zone libre";
        niveau_alerte = "Normal";
    }

    return {
        distance_cm,
        action,
        etat,
        niveau_alerte,
        zone,
        datetime: new Date()
    };
}

module.exports = { logicultrasonic };