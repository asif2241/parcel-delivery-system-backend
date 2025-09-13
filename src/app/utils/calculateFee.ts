// export const calculateFees = (weight: number, BASE_FEE: number) => {
//     if (weight <= 3) {
//         return BASE_FEE
//     } else if (weight <= 10) {
//         return BASE_FEE + (weight - 3) * (BASE_FEE / 2)
//     } else if (weight <= 20) {
//         return BASE_FEE + (weight - 3) * (BASE_FEE / 4)
//     } else if (weight > 20) {
//         return BASE_FEE + (weight - 3) * (BASE_FEE / 5)
//     }
// }

export const calculateParcelFee = (weight: number): number => {
    if (weight <= 0) {
        return 0
    }

    const BASE_FEE = 100;
    const BASE_WEIGHT = 3;

    //Tier 1: 100 bdt for the first 3 kg
    if (weight < BASE_WEIGHT) {
        return BASE_FEE
    }
    //Tier 2: For weight between 3 kg and 10 kg
    if (weight <= 10) {
        const additionalWeight = weight - BASE_WEIGHT;
        const additionalFee = additionalWeight * 50;
        return BASE_FEE + additionalFee;
    }

    //Tier 3: For weight between 10 kg and 20 kg
    if (weight <= 20) {
        const tier2Cost = (10 - BASE_WEIGHT) * 50;
        const additionalCost = (weight - 10) * 30;
        return BASE_FEE + tier2Cost + additionalCost
    }

    //calculation fee for above 20 kilo

    const tier2cost = (10 - BASE_WEIGHT) * 50;
    const tier3cost = (20 - 10) * 30;

    const additionalWeight = weight - 20;
    const additionalFee = additionalWeight * 20;
    return BASE_FEE + tier2cost + tier3cost + additionalFee
}