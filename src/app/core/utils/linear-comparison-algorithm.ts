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
    let Xn = x0;
    let period = 0;
    do {
        Xn = (a * Xn + c) % m;
        period++;
    } while (Xn !== x0);

    return period;
}
