
interface TFraccionEquivalente {
    numerador: number;
    denominador: number;
    factor: number;
}

export interface TResta {
    minuendo: string;
    sustraendo: string;
    resta: string;
    colspan: number;
}

interface TDividir {
    dividendo: number;
    divisor: number;
    fraccion: TFraccionEquivalente;
    cociente: number;
    restas: TResta[];
}

function truncarDecimal(numero: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.trunc(numero * factor) / factor;
}

function fraccionEquivalente(numerador: number, denominador: number): TFraccionEquivalente {
    const obtenerFactor = (num: number): number => Math.pow(10, (num.toString().split('.')[1] || '').length);
    const factor = Math.max(obtenerFactor(numerador), obtenerFactor(denominador));
    return {
        numerador: Math.round(numerador * factor),
        denominador: Math.round(denominador * factor),
        factor
    };
}


function restar(dividendo: number, divisor: number, cociente: number): TResta[] {
    let restas: TResta[] = [];
    const cola: string = (dividendo * (10 ** cociente.toString().replace(".", "").length)).toString();
    let factores: number[] = cociente.toString().replace(/\./g, '').split('').map(num => parseInt(num, 10));
    let minuendo: number = 0;
    let sustraendo: number = 0;
    let resta: number = 0;
    let colspan: number = 0;
    let ancho: number = 0;
    factores.map((factor: number, index: number) => {
        sustraendo = factor * divisor;
        if (index === 0) {
            if (divisor < dividendo) { ancho = divisor.toString().length }
            else { ancho = dividendo.toString().length }
            minuendo = parseInt(cola.substring(0, ancho), 10);
            while (minuendo < sustraendo) {
                minuendo = minuendo * 10 + parseInt(cola.substring(ancho, ancho + 1))
                ancho += 1;
            }
        }
        else { minuendo = parseInt(restas[index - 1].resta, 10) * 10 + parseInt(cola.substring(ancho + index - 1, ancho + index)) }
        resta = minuendo - sustraendo;
        colspan += minuendo.toString().length - resta.toString().length;
        restas.push({ minuendo: minuendo.toString(), sustraendo: sustraendo.toString(), resta: resta.toString(), colspan })
    })
    return restas;
}

export function divide(dividendo: number, divisor: number, decimales: number = 0): TDividir {
    if (decimales > 14) { decimales = 14 }
    const cociente = truncarDecimal(dividendo / divisor, decimales);
    const fraccion = fraccionEquivalente(dividendo, divisor);
    const restas: TResta[] = restar(fraccion.numerador, fraccion.denominador, cociente);
    return { dividendo, divisor, fraccion, cociente, restas };
}