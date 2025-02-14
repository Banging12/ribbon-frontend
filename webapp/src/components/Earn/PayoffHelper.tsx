import { VaultOptions } from "shared/lib/constants/constants";
import { calculateExpectedYieldSTETH } from "shared/lib/hooks/useAirtableEarnData";

export const isPerformanceBelowBarriers = (
  performance: number,
  lowerBarrierPercentage: number
) => {
  return performance < lowerBarrierPercentage;
};

export const isPerformanceAboveBarriers = (
  performance: number,
  upperBarrierPercentage: number
) => {
  return performance > upperBarrierPercentage;
};

export const isPerformanceOutsideBarriers = (
  performance: number,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number
) => {
  return (
    performance < lowerBarrierPercentage || performance > upperBarrierPercentage
  );
};

export const getOptionMoneyness = (
  hoverPercentage: number | undefined,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  performance: number,
  vaultOption: VaultOptions
) => {
  switch (vaultOption) {
    case "rEARN":
      if (hoverPercentage) {
        return isPerformanceOutsideBarriers(
          hoverPercentage,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : hoverPercentage + 1;
      } else {
        return isPerformanceOutsideBarriers(
          performance,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (performance + 1) / 1;
      }
    case "rEARN-stETH":
      if (hoverPercentage) {
        return isPerformanceOutsideBarriers(
          hoverPercentage,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (hoverPercentage + 1) / (1 + lowerBarrierPercentage);
      } else {
        return isPerformanceOutsideBarriers(
          performance,
          lowerBarrierPercentage,
          upperBarrierPercentage
        )
          ? 0
          : (performance + 1) / (1 + lowerBarrierPercentage);
      }
    default:
      return 0;
  }
};

const getLeftBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return 2000;
    case "rEARN-stETH":
      return 2000;
    default:
      return 0;
  }
};

const getRightBaseYieldPoints = (vaultOption: VaultOptions) => {
  switch (vaultOption) {
    case "rEARN":
      return 2000;
    case "rEARN-stETH":
      return 2000;
    default:
      return 0;
  }
};

export const getOptionMoneynessRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  switch (vaultOption) {
    case "rEARN":
      // points that represent the moneyness below lower barrier
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 100) -
            (leftBaseYieldPoints - i) / 100
        );
      }

      // points that represent the moneyness between barriers
      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(i / 100);
      }

      // points that represent the moneyness above upper barrier
      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(
          Math.round(upperBarrierPercentage * 100) + (i + 1) / 100
        );
      }

      return [...leftArray, ...array, ...rightArray];
    case "rEARN-stETH":
      // points that represent the moneyness below lower barrier
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(
          Math.round(lowerBarrierPercentage * 100) -
            (leftBaseYieldPoints - i) / 100
        );
      }

      // points that represent the moneyness when between barriers
      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(i / 100);
      }

      // points that represent the moneyness above upper barrier
      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(
          Math.round(upperBarrierPercentage * 100) + (i + 1) / 100
        );
      }

      return [...leftArray, ...array, ...rightArray];
    default:
      return [];
  }
};

export const getYieldRange = (
  vaultOption: VaultOptions,
  lowerBarrierPercentage: number,
  upperBarrierPercentage: number,
  maxYield: number,
  baseYield: number,
  participationRate: number
) => {
  let leftArray = [];
  let array = [];
  let rightArray = [];
  const leftBaseYieldPoints = getLeftBaseYieldPoints(vaultOption);
  const rightBaseYieldPoints = getRightBaseYieldPoints(vaultOption);
  const baseYieldPercentage = baseYield * 100;
  switch (vaultOption) {
    case "rEARN":
      // points that represent the base yield below lower barrier
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(baseYieldPercentage);
      }

      // points that represent the expected yield between barriers
      for (
        let i = Math.round(lowerBarrierPercentage * 100) * 100;
        i <= Math.round(upperBarrierPercentage * 100) * 100;
        i += 1
      ) {
        array.push(
          baseYieldPercentage +
            Math.abs(i / 100 / (upperBarrierPercentage * 100)) *
              (maxYield - baseYield) *
              100
        );
      }

      // points that represent the base yield above upper barrier
      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(baseYieldPercentage);
      }
      return [
        ...leftArray,
        baseYieldPercentage,
        ...array,
        baseYieldPercentage,
        ...rightArray,
      ];
    case "rEARN-stETH":
      // points that represent the base yield below lower barrier
      for (let i = 0; i < leftBaseYieldPoints; i += 1) {
        leftArray.push(baseYieldPercentage);
      }

      const barriersSum = upperBarrierPercentage - lowerBarrierPercentage;
      // we multiply the number by 10000 to make plotting easier
      const barriersSumLargeNumber = Math.round(barriersSum * 100) * 100;

      // points that represent the expected yield between barriers
      // add incremental amounts of expected yield from base yield to max yield
      for (let i = 0; i <= barriersSumLargeNumber; i += 1) {
        const percentage = i / barriersSumLargeNumber;
        const performance = percentage * barriersSum + lowerBarrierPercentage;
        array.push(
          calculateExpectedYieldSTETH(
            baseYield,
            performance,
            lowerBarrierPercentage,
            participationRate
          ) * 100
        );
      }

      // points that represent the base yield above upper barrier
      for (let i = 0; i < rightBaseYieldPoints; i += 1) {
        rightArray.push(baseYieldPercentage);
      }
      return [
        ...leftArray,
        baseYieldPercentage,
        ...array,
        baseYieldPercentage,
        ...rightArray,
      ];
    default:
      return [];
  }
};
