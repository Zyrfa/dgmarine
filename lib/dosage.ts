export interface DosageParams {
  tankVolume: number
  baseConc: number
  unit: 'ml/L' | '%' | 'g/L'
}

export interface DosageResult {
  amount: number
  unit: string
  label: string
}

export function calculateDosage({ tankVolume, baseConc, unit }: DosageParams): DosageResult {
  if (!tankVolume || tankVolume <= 0) return { amount: 0, unit: 'L', label: '0 L' }

  switch (unit) {
    case 'ml/L': {
      const ml = tankVolume * baseConc
      return ml >= 1000
        ? { amount: ml / 1000, unit: 'L', label: `${(ml / 1000).toFixed(2)} L` }
        : { amount: ml, unit: 'ml', label: `${ml.toFixed(0)} ml` }
    }
    case '%': {
      const liters = (tankVolume * baseConc) / 100
      return { amount: liters, unit: 'L', label: `${liters.toFixed(2)} L` }
    }
    case 'g/L': {
      const grams = tankVolume * baseConc
      return grams >= 1000
        ? { amount: grams / 1000, unit: 'kg', label: `${(grams / 1000).toFixed(2)} kg` }
        : { amount: grams, unit: 'g', label: `${grams.toFixed(0)} g` }
    }
  }
}
