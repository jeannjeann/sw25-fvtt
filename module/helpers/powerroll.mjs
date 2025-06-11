// Power Roll

import { rpt } from "../sw25.mjs";

/**
 * Execute a custom roll and return the result.
 */
export async function powerRoll(formula, powertable) {
  for (let i = 0; i < powertable.length; i++) {
    if (i == 17) continue;
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
  let power = Number(powertable[0]);
  let cValue = Number(powertable[1]);
  for (let i = 2; i <= 12; i++) {
    powertable[i] = Number(powertable[i]);
  }
  let powMod = Number(powertable[13]);
  let halfPow = Number(powertable[14]);
  let halfPowMod = Number(powertable[15]);
  let lethalTech = Number(powertable[16]);
  let criticalRay = powertable[17];
  let pharmTool = Number(powertable[18]);
  let powup = Number(powertable[19]);

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
      if (powertable[total] == null || powertable[total] == 0) {
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
