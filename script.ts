interface LooseObject {
    [key: string]: (l: number, r: number) => number,
}

const splitNonDigitOrDigit = /\D|\d+/g;

enum operators {
    plus = "+",
    minus = "-",
    times = "*",
    divide = "/",
    root = "^"
}

const plusMinus = [operators.plus, operators.minus];
const timesDivide = [operators.times, operators.divide];

const operations: LooseObject = {
    [operators.root]: (l: number, r: number) => Math.pow(l, r),
    [operators.plus]: (l: number, r: number) => l + r,
    [operators.times]: (l: number, r: number) => l * r,
    [operators.divide]: (l: number, r: number) => l / r,
    [operators.minus]: (l: number, r: number) => l - r,
}

const calculate = (operator: string, left: string, right: string) => operations[operator](parseInt(left), parseInt(right));
const findRoot = (matched: any[]) => matched.indexOf(operators.root);
const findPlusOrMinus = (matched: any[]) => matched.findIndex(match => plusMinus.includes(match));
const findTimesOrDivide = (matched: any[]) => matched.findIndex(match => timesDivide.includes(match));

const runCalculation = function (matched: any[], operatorIdx: number) {
    const lefIdx = operatorIdx - 1;
    const rightIdx = operatorIdx + 1;

    matched[lefIdx] = calculate(matched[operatorIdx], matched[lefIdx], matched[rightIdx]);

    matched.splice(rightIdx, 1);
    matched.splice(operatorIdx, 1);
}

const doCalculation = (matched: any[], callback: (matched: any[]) => number) => {
    const operationIdx = callback(matched);

    if (operationIdx === -1) return;

    runCalculation(matched, operationIdx);
    doCalculation(matched, callback);
}

const solutionTwo = function (operation: string) {
    const matched = operation.match(splitNonDigitOrDigit) as any[];

    if (matched === null) return new Error;

    doCalculation(matched, findRoot);
    doCalculation(matched, findTimesOrDivide);
    doCalculation(matched, findPlusOrMinus);

    return matched[0];
}

const [operation]: string[] = Deno.args as unknown as string[];

console.log(solutionTwo(operation))