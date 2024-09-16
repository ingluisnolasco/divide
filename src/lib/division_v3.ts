import { bignumber, subtract, multiply, divide, format } from 'mathjs';

export interface TOperacion {
    factor: string;
    minuendo: string;
    sustraendo: string;
    resta: string;
    colspan: number;
}

export interface TFraccionEquivalente {
    numerador: string;
    denominador: string;
    factor: number;
}

export interface TDivision {
    dividendo: string;
    divisor: string;
    cociente: string;
    fraccion: TFraccionEquivalente;
    operaciones: TOperacion[];
}

function fraccionEquivalente(dividendo: string, divisor: string): TFraccionEquivalente {
    const ofactor = (num: string): number => Math.pow(10, (num.toString().split('.')[1] || '').length);
    const factor: number = Math.max(ofactor(dividendo), ofactor(divisor));
    const numerador: string = multiply(bignumber(dividendo), bignumber(factor)).toString();
    const denominador: string = multiply(bignumber(divisor), bignumber(factor)).toString();
    return {
        numerador,
        denominador,
        factor
    };
}

function restasSucesivas(dividendo: string, divisor: string, cociente: string): TOperacion[] {
    let lista: TOperacion[] = [];
    const cola: string = dividendo + "0".repeat(cociente.length);
    let minuendo: string = "0";
    let sustraendo: string = "0";
    let resta: string = "0";
    let colspan: number = 0;
    let ancho: number = 0;

    cociente.replace(".", "").split("").map((factor: string, index: number) => {
        sustraendo = multiply(bignumber(divisor), bignumber(factor)).toString();
        if (index === 0) {
            if (parseInt(divisor) < parseInt(dividendo)) { ancho = divisor.length }
            else { ancho = dividendo.length }
            minuendo = cola.substring(0, ancho);
            while (minuendo < sustraendo) {
                minuendo = minuendo + cola.substring(ancho, ancho + 1)
                ancho += 1;
            }

        }
        else { minuendo = lista[index - 1].resta + cola.substring(ancho + index - 1, ancho + index) }
        resta = subtract(bignumber(minuendo), bignumber(sustraendo)).toString();
        colspan += minuendo.length - resta.length;
        lista.push({ factor, minuendo, sustraendo, resta, colspan });
    })
    return lista;
}

export function division(dividendo: string, divisor: string, decimales: string): TDivision {
    let cociente: string;

    if (decimales === "0") {
        cociente = (format(divide(bignumber(dividendo), bignumber(divisor)),
            { notation: 'fixed', precision: 0 }));

    }
    else {
        cociente = (format(divide(bignumber(dividendo), bignumber(divisor)),
            { notation: 'fixed', precision: (parseInt(decimales, 10) + 1) })).slice(0, -1);

    }

    const fraccion: TFraccionEquivalente = fraccionEquivalente(dividendo, divisor);
    const operaciones: TOperacion[] = restasSucesivas(fraccion.numerador, fraccion.denominador, cociente.toString());
    return { dividendo, divisor, cociente: cociente.toString(), fraccion, operaciones }
}