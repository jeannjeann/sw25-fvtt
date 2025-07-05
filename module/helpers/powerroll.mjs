// Power Roll

import { rpt } from "../sw25.mjs";

/**
 * Powertable index
 */
export const PT = {
  POWER: 0,
  CVALUE: 1,
  TABLE_2: 2,
  TABLE_3: 3,
  TABLE_4: 4,
  TABLE_5: 5,
  TABLE_6: 6,
  TABLE_7: 7,
  TABLE_8: 8,
  TABLE_9: 9,
  TABLE_10: 10,
  TABLE_11: 11,
  TABLE_12: 12,
  POWMOD: 13,
  HALFPOW: 14,
  HALFPOWMOD: 15,
  LETHALTECH: 16,
  CRITICALRAY: 17,
  PHARMTOOL: 18,
  POWUP: 19,
  POWTABLEMOD: 20,
};

/**
 * Execute a custom roll and return the result.
 */
export async function powerRoll(formula, powertable) {
  for (let i = 0; i < powertable.length; i++) {
    if (i == PT.CRITICALRAY) continue;
    if (
      powertable[i] === null ||
      Number.isNaN(powertable[i]) ||
      powertable[i] === undefined
    ) {
      powertable[i] = 0;
    }
  }

  let powerResult = 0;
  let rollCount = 0;
  let fumble = 0;
  let power = Number(powertable[PT.POWER]);
  let cValue = Number(powertable[PT.CVALUE]);

  let blankpt = true;
  for (let i = PT.TABLE_2; i <= PT.TABLE_12; i++) {
    powertable[i] =
      powertable[i] === null ||
      powertable[i] === "" ||
      powertable[i] === undefined ||
      Number.isNaN(powertable[i])
        ? null
        : Number(powertable[i]);
    if (typeof powertable[i] === "number" && powertable[i] !== 0) {
      blankpt = false;
    }
  }
  if (blankpt) {
    for (let i = 2; i <= 12; i++) {
      powertable[i] = null;
    }
  }

  let powMod = Number(powertable[PT.POWMOD]);
  let halfPow = Number(powertable[PT.HALFPOW]);
  let halfPowMod = Number(powertable[PT.HALFPOWMOD]);
  let lethalTech = Number(powertable[PT.LETHALTECH]);
  let criticalRay = powertable[PT.CRITICALRAY];
  let pharmTool = Number(powertable[PT.PHARMTOOL]);
  let powup = Number(powertable[PT.POWUP]);

  if (cValue == null || cValue == 0) cValue = 10;
  if (cValue < 8) cValue = 8;
  if (cValue > 12 || halfPow != 0) cValue = 100;

  let result = new Roll(formula);

  await result.evaluate();
  let results = result.terms[0].results;
  let diceResults = results.map((result) => result.result);
  let total = result.result;
  if (pharmTool != 0) {
    diceResults[0] = Number(pharmTool);
    total = diceResults[1] + Number(pharmTool);
  }

  let fakeDiceResults = diceResults;

  if (lethalTech != 0 && total != 2) {
    total = Number(total) + Number(lethalTech);
    if (total < 2) total = 3;
  }
  if (criticalRay && criticalRay != 0 && total != 2) {
    if (/^f\d+$/.test(criticalRay)) {
      let fixresults = criticalRay.substring(1);
      total = Number(fixresults);
      if (total < 1) total = 2;
    } else {
      total = Number(total) + Number(criticalRay);
      if (total < 2) total = 3;
    }
  }
  if (total > 12) total = 12;

  let ptv = powertable[total];
  if (powertable[total] == null) {
    power += Number(powertable[PT.POWTABLEMOD] ?? 0);
    if (power > 100) power = 100;
    ptv = rpt[power][total - 3];
  }

  if (total == 2) {
    fumble = 1;
    ptv = 0;
  }

  powerResult += ptv;

  let eachPowerResult = [];
  eachPowerResult.push(ptv);

  while (total >= cValue) {
    rollCount++;
    result = new Roll(formula);
    await result.evaluate();
    results = result.terms[0].results;
    diceResults = results.map((result) => result.result);
    total = result.result;
    /* if to enable the use of pharmacist tools in extra rolls, uncomment this section.
    if (pharmTool != 0) {
      diceResults[0] = Number(pharmTool);
      total = diceResults[1] + Number(pharmTool);
    }
    */
    fakeDiceResults.push(diceResults[0]);
    fakeDiceResults.push(diceResults[1]);

    if (lethalTech != 0 && total != 2)
      total = Number(total) + Number(lethalTech);
    if (total > 12) total = 12;

    if (powup != 0) {
      let uppow = power + powup * rollCount;
      if (uppow > 100) uppow = 100;
      ptv = rpt[uppow][total - 3];
    } else {
      ptv = powertable[total];
      if (powertable[total] == null) {
        ptv = rpt[power][total - 3];
      }
    }

    if (total == 2) ptv = 0;

    powerResult += ptv;
    eachPowerResult.push(ptv);
  }

  let diceNumber = (rollCount + 1) * 2;
  let fakeResult = new Roll(diceNumber + "d6");
  await fakeResult.evaluate();
  for (let i = 0; i < fakeDiceResults.length; i++) {
    fakeResult.terms[0].results[i].result = fakeDiceResults[i];
  }

  let rawPowerResult = powerResult;
  powerResult += powMod;
  if (halfPow == 1) powerResult = Math.ceil(powerResult / 2) + halfPowMod;
  if (halfPow == 0) powerResult = Number(powerResult) + Number(halfPowMod);

  if (fumble == 1) powerResult = 0;

  return {
    powerResult,
    rollCount,
    fumble,
    fakeResult,
    eachPowerResult,
    rawPowerResult,
    power,
    cValue,
    powMod,
    halfPow,
    halfPowMod,
    lethalTech,
    criticalRay,
    pharmTool,
    powup,
  };
}
