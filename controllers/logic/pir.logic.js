// logic/pir.logic.js

function logicPir(etat_mouvement) {
    const mouvement = !!etat_mouvement;
    
    const action = mouvement 
        ? "Mouvement détecté" 
        : "Zone sans mouvement";
        
    const message_detaille = mouvement
        ? "Activité détectée dans la zone"
        : "Aucun mouvement récent";

    return {
        etat_mouvement: mouvement,
        action,
        etat: mouvement,
        zone: "Couloir B",
        message_detaille,
        datetime: new Date()
    };
}

module.exports = { logicPir };