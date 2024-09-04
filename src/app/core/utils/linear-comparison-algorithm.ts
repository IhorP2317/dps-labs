export function generateRandomNumbers(
    m: number,
    a: number,
    c: number,
    x0: number,
    amount: number,
): number[] {
    const sequenceOfNumbers: number[] = [];
    let Xn = x0;
    sequenceOfNumbers.push(Xn);
    for (let i = 0; i < amount; ++i) {
        Xn = (a * Xn + c) % m;
        // const currentTimeMod = Date.now() % m;
        // const pseudoRandomNumber = (Xn * currentTimeMod) % m;

        sequenceOfNumbers.push(Xn);
    }
    return sequenceOfNumbers;
}
export function calculatePeriodWithTime(
    m: number,
    a: number,
    c: number,
    x0: number,
): number {
    const seen = new Set<number>();
    let Xn = x0;
    let period = 0;

    while (!seen.has(Xn)) {
        seen.add(Xn);
        Xn = (a * Xn + c) % m;
        period++;
    }

    return period;
}
