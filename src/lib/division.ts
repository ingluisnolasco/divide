
interface TFraccionEquivalente {
    numerador: number;
    denominador: number;
    factor: number;
}

export interface TResta {
    minuendo: string;
    sustraendo: string;
    resta: string;
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
    let cola: string = (dividendo * 10 ** (divisor.toString().length)).toString();
    let factores: number[] = cociente.toString().replace(/\./g, '').split('').map(num => parseInt(num, 10));
    let restas: TResta[] = [];
    let ancho: number = 0;
    factores.map((factor: number, index: number) => {
        let minuendo: number = 0;
        let sustraendo: number = (divisor * factor);
        if (index == 0) {
            ancho = sustraendo.toString().length;
            minuendo = parseInt(cola.substring(0, ancho));
            if (minuendo < sustraendo) {
                ancho += 1;
                minuendo = parseInt(cola.substring(0, ancho));
            }
        }
        else { minuendo = Number(restas[index - 1].resta) * 10 + Number(cola.substring(index + ancho - 1, index + ancho)) }
        let resta: number = minuendo - sustraendo;
        restas.push({ minuendo: minuendo.toString(), sustraendo: sustraendo.toString(), resta: resta.toString() });
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