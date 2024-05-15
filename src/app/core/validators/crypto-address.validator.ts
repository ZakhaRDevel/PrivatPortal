import { AbstractControl, ValidatorFn } from '@angular/forms';

export function CryptoAddressValidator(
    networkId: number,
    initialValue?: string
): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        try {
            const value = control.value.toString();

            if (value.length) {
                switch (networkId) {
                    case 1:
                        return erc20(value) ? null : { wrongWallet: true };
                    case 2:
                        return trc20(value) ? null : { wrongWallet: true };
                    default:
                        return { wrongWallet: true };
                }
            }
        } catch {
            return { wrongWallet: true };
        }
    };
}

function erc20(value: string): boolean {
    if (/^0x([A-Fa-f0-9]{40})$/.test(value)) {
        return true;
    }
    return false;
}

function trc20(value: string): boolean {
    if (/^T([0-9a-zA-Z]{33})$/.test(value)) {
        return true;
    }
    return false;
}
