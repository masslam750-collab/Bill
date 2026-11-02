import { TariffCalculation } from '../types';

export function calculateNepraElectricityBill(
  units: number,
  category: 'domestic_protected' | 'domestic_unprotected' | 'commercial' | 'industrial',
  isTou: boolean = false,
  peakUnits: number = 0,
  offPeakUnits: number = 0
): TariffCalculation {
  let baseCost = 0;

  if (isTou && (peakUnits > 0 || offPeakUnits > 0)) {
    // Time of Use (TOU) 3-phase meters
    const peakRate = 42.12;
    const offPeakRate = 35.85;
    baseCost = peakUnits * peakRate + offPeakUnits * offPeakRate;
  } else {
    // Slabs logic (NEPRA approved)
    if (category === 'domestic_protected') {
      // Protected consumers (consistently consume <= 200 units for last 6 months)
      if (units <= 50) {
        baseCost = units * 7.74; // Lifeline 1-50
      } else if (units <= 100) {
        baseCost = 50 * 7.74 + (units - 50) * 10.06;
      } else if (units <= 200) {
        baseCost = 100 * 10.06 + (units - 100) * 14.21;
      } else {
        // Falls into unprotected
        baseCost = units * 22.95;
      }
    } else if (category === 'domestic_unprotected') {
      if (units <= 100) {
        baseCost = units * 16.48;
      } else if (units <= 200) {
        baseCost = 100 * 16.48 + (units - 100) * 22.95;
      } else if (units <= 300) {
        baseCost = 100 * 16.48 + 100 * 22.95 + (units - 200) * 27.14;
      } else if (units <= 400) {
        baseCost = 100 * 16.48 + 100 * 22.95 + 100 * 27.14 + (units - 300) * 32.03;
      } else if (units <= 500) {
        baseCost = 100 * 16.48 + 100 * 22.95 + 100 * 27.14 + 100 * 32.03 + (units - 400) * 35.24;
      } else if (units <= 600) {
        baseCost = 100 * 16.48 + 100 * 22.95 + 100 * 27.14 + 100 * 32.03 + 100 * 35.24 + (units - 500) * 36.66;
      } else if (units <= 700) {
        baseCost = 100 * 16.48 + 100 * 22.95 + 100 * 27.14 + 100 * 32.03 + 100 * 35.24 + 100 * 36.66 + (units - 600) * 37.80;
      } else {
        baseCost = units * 42.72;
      }
    } else if (category === 'commercial') {
      baseCost = units * 45.15;
    } else {
      // industrial
      baseCost = units * 38.60;
    }
  }

  const effectiveUnits = isTou ? peakUnits + offPeakUnits : units;
  
  // Fuel Price Adjustment (FPA) ~ Rs 2.85 per unit
  const fpa = Math.round(effectiveUnits * 2.85);

  // Financing Cost Surcharge (FC Surcharge) ~ Rs 3.23 per unit
  const fcSurcharge = Math.round(effectiveUnits * 3.23);

  // Quarterly Tariff Adjustment (QTA) ~ Rs 1.45 per unit
  const qtrAdjustment = Math.round(effectiveUnits * 1.45);

  // Electricity Duty (ED) ~ 1.5% of base
  const electricityDuty = Math.round(baseCost * 0.015);

  // General Sales Tax (GST) ~ 18% (exemption for protected <= 200 units)
  const isGstExempt = category === 'domestic_protected' && effectiveUnits <= 200;
  const salesTax = isGstExempt ? 0 : Math.round((baseCost + fpa + qtrAdjustment) * 0.18);

  // PTV Fee (Rs. 35 flat for domestic, Rs. 60 for commercial)
  const tvFee = category === 'commercial' ? 60 : 35;

  const totalPayable = Math.round(baseCost + fpa + fcSurcharge + qtrAdjustment + electricityDuty + salesTax + tvFee);

  return {
    units: effectiveUnits,
    category,
    isTou,
    peakUnits,
    offPeakUnits,
    baseCost: Math.round(baseCost),
    fpa,
    fcSurcharge,
    qtrAdjustment,
    electricityDuty,
    salesTax,
    tvFee,
    totalPayable
  };
}
