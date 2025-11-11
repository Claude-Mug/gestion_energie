// logic/actionneurs.logic.js

function logicActionneurs(data) {
    const {
        led_lr,
        led_lb,
        led_lw,
        led_lj,
        moteur,
        buzzer
    } = data;

    const description = [];

    // Convertit les valeurs en booléens si nécessaire
    const bool_lr = !!led_lr;
    const bool_lb = !!led_lb;
    const bool_lw = !!led_lw;
    const bool_lj = !!led_lj;
    const bool_moteur = !!moteur;
    const bool_buzzer = !!buzzer;

    if (bool_lr) description.push("LED rouge allumée");
    if (bool_lb) description.push("LED bleue allumée");
    if (bool_lw) description.push("LED blanche allumée");
    if (bool_lj) description.push("LED jaune allumée");
    if (bool_moteur) description.push("Moteur activé");
    if (bool_buzzer) description.push("Buzzer activé");

    if (
        !bool_lr &&
        !bool_lb &&
        !bool_lw &&
        !bool_lj &&
        !bool_moteur &&
        !bool_buzzer
    ) {
        description.push("Tous les actionneurs désactivés");
    }

    return {
        led_lr: bool_lr,
        led_lb: bool_lb,
        led_lw: bool_lw,
        led_lj: bool_lj,
        moteur: bool_moteur,
        buzzer: bool_buzzer,
        description: description.join(" - "),
        datetime: new Date()
    };
}

module.exports = { logicActionneurs };