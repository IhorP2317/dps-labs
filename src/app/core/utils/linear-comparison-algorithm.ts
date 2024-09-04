export function generateRandomNumbers(m: number, a:number, c:number, x0:number, amount:number): number[] {
    const sequenceOfNumbers:number[] = [];
    let Xn = x0;
    for (let i = 0; i < amount; ++i) {
        if(i === 0)
            sequenceOfNumbers.push(Xn);
        Xn = (a*Xn + c)%m;
    const currentTimeMod = Date.now() % m;
    const pseudoRandomNumber = (Xn * currentTimeMod) % m;

        sequenceOfNumbers.push(pseudoRandomNumber);
    }
    return sequenceOfNumbers;
}
