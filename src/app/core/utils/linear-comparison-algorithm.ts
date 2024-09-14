export function generateRandomNumbers(
    m: number,
    a: number,
    c: number,
    x0: number,
    amount: number,
): Uint32Array {
    const sequenceOfNumbers = new Uint32Array(amount);
    let Xn = x0;
    sequenceOfNumbers[0] = Xn;

    for (let i = 1; i <= amount; ++i) {
        Xn = (a * Xn + c) % m;
        sequenceOfNumbers[i] = Xn;
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
    const sequenceOfNumbers = new Uint32Array(m);
    sequenceOfNumbers[0] = Xn;
    do {
        if (period >= m) break;
        Xn = (a * Xn + c) % m;
        ++period;
        sequenceOfNumbers[period] = Xn;
    } while (
        Xn !== x0 &&
        Xn !== sequenceOfNumbers[period > 1 ? period - 2 : 0]
    );

    return period > 1 ? period - 1 : period;
}
