import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { CountryModel } from 'src/app/data/models/country.model';
import { PageModel } from 'src/app/data/models/page.models';
import { LanguageService } from 'src/app/data/services/language.service';
import { PhoneNumberUtil } from 'google-libphonenumber';
const phoneNumberUtil = PhoneNumberUtil.getInstance();

@Component({
    selector: 'pc-input-phone',
    templateUrl: './input-phone.component.html',
    styleUrls: ['./input-phone.component.scss'],
})
export class InputPhoneComponent implements OnInit, OnChanges {
    @Input() items: CountryModel[] = [];
    @Input() control: any;
    @Input() isInvalid: boolean;
    @Input() placeholder: string;
    @Input() errorsTranslate: PageModel;
    @Input() notFoundText: string = '';
    @Input() country: CountryModel;
    @Input() initialValue: string;

    @Output() onTypeEvent: EventEmitter<string> = new EventEmitter<string>();

    selectedCountry: CountryModel;

    isManual: boolean;
    kw: string = '';

    init: boolean;

    get value(): string {
        return this.control.value;
    }

    constructor(private langService: LanguageService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes?.items?.previousValue?.length) {
            if (this.initialValue && !this.init) {
                const country = this.findCountryByNumber(this.initialValue);

                if (country) {
                    this.selectedCountry = country;
                    this.control.setValue(this.initialValue);
                    this.init = true;
                }
            } else {
                if (!this.selectedCountry) {
                    this.selectedCountry = this.items.find(
                        (itm) => itm.code === 'US'
                    );
                }

                if (this.selectedCountry && !this.init) {
                    this.control.setValue(this.selectedCountry.phoneCode);
                    this.init = true;
                }
            }
        }
    }

    ngOnInit(): void {
        this.control.setValidators(this.validatorPhoneNumber());
        this.control.updateValueAndValidity();
    }

    onChange(e) {
        this.isManual = true;
        this.control.setValue(this.selectedCountry.phoneCode);
        this.onTypeEvent.emit('phone');
    }

    onType() {
        this.onTypeEvent.emit('phone');
    }

    validatorPhoneNumber() {
        return (control: FormControl) => {
            const val = control.value || '';

            if (this.selectedCountry?.phoneCode) {
                try {
                    const results = phoneNumberUtil?.parseAndKeepRawInput(
                        val,
                        this.selectedCountry.code
                    );

                    if (!phoneNumberUtil.isValidNumber(results)) {
                        return {
                            wrongPhone: true,
                        };
                    }

                    const country = this.findCountryByNumber(val);

                    if (this.selectedCountry?.code !== country?.code) {
                        return {
                            wrongPhone: true,
                        };
                    }
                } catch (e) {
                    return {
                        wrongPhone: true,
                    };
                }
            }

            return null;
        };
    }

    numberOnly(event: any) {
        const pattern = /^\+.[0-9]*$/;

        let val = this.value;

        if (!val) {
            val = '';
        }

        if (event.keyCode !== 8) {
            val += event.key;
        }

        if (val.length === 1 && val !== '+' && event.keyCode !== 8) {
            event.preventDefault();
        }

        if (val.length > 1 && !pattern.test(val) && event.keyCode !== 8) {
            event.preventDefault();
        }

        if (val.length > 15) {
            event.preventDefault();
        }

        if (val.length <= 3 && event.keyCode === 8) {
            this.isManual = false;
        }

        if (val !== '+' && val !== '' && !this.isManual) {
            const country = this.items.find(
                (itm) =>
                    val.includes(itm.phoneCode) &&
                    itm.phoneCode !== this.selectedCountry.phoneCode
            );

            if (country) {
                this.selectedCountry = country;
            }
        }
    }

    findCountryByNumber(phone: string) {
        const number = phoneNumberUtil?.parseAndKeepRawInput(phone);
        const code = phoneNumberUtil?.getRegionCodeForNumber(number);

        if (number) {
            let item = this.items.find(
                (itm) => itm.code.toLowerCase() === code?.toLowerCase()
            );

            if (!item) {
                item = this.items.find(
                    (itm) => itm.phoneCode === `+${number.getCountryCode()}`
                );
            }

            return item;
        }

        return null;
    }
}
