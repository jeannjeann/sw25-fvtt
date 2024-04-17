// Power Roll

/**
 * Execute a custom roll and return the result.
 */
export function powerRoll(formula, powertable) {
  let powerResult = 0;
  let rollCount = 0;
  let fumble = 0;
  let power = powertable[0];
  let cValue = powertable[1];
  let powMod = powertable[13];
  let halfPow = powertable[14];
  let halfPowMod = powertable[15];
  let lethalTech = powertable[16];
  let criticalRay = powertable[17];
  let pharmTool = powertable[18];

  if (cValue == null || cValue == 0) cValue = 10;
  if (cValue < 8) cValue = 8;
  if (cValue > 12 || halfPow != 0) cValue = 100;

  let result = new Roll(formula);

  result.evaluate();
  let results = result.terms[0].results;
  let diceResults = results.map((result) => result.result);
  let total = result.result;
  if (pharmTool != 0) {
    diceResults[0] = Number(pharmTool);
    total = diceResults[1] + Number(pharmTool);
  }
  let fakeDiceResults = diceResults;

  if (total == 2) fumble = 1;

  if (lethalTech != 0) total = Number(total) + Number(lethalTech);
  if (criticalRay != 0) total = Number(total) + Number(criticalRay);
  if (total > 12) total = 12;

  powerResult += powertable[total];

  let eachPowerResult = [];
  eachPowerResult.push(powertable[total]);

  while (total >= cValue) {
    rollCount++;
    result = new Roll(formula);
    result.evaluate();
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

    powerResult += powertable[total];
    eachPowerResult.push(powertable[total]);
  }

  let diceNumber = (rollCount + 1) * 2;
  let fakeResult = new Roll(diceNumber + "d6");
  fakeResult.evaluate();
  for (let i = 0; i < fakeDiceResults.length; i++) {
    fakeResult.terms[0].results[i].result = fakeDiceResults[i];
  }

  let rawPowerResult = powerResult;
  powerResult += powMod;
  if (halfPow == 1) powerResult = Math.ceil(powerResult / 2) + halfPowMod;

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
  };
}
