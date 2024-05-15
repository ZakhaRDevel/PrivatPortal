import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { LanguageModel } from '../../../data/models/language.models';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { HiddenMenuService } from '../../../core/services/hidden-menu.service';
import { SwipeService } from '../../../core/services/swipe.service';
import { LanguageService } from 'src/app/data/services/language.service';
import { LangService } from 'src/app/core/services/lang.service';

@Component({
    selector: 'app-lang-switcher',
    templateUrl: './lang-switcher.component.html',
    styleUrls: ['./lang-switcher.component.scss'],
    animations: [
        trigger('toggle', [
            state(
                'shown',
                style({
                    height: '*',
                    opacity: '*',
                    overflow: 'hidden',
                    padding: '*',
                    margin: '*',
                })
            ),
            state(
                'hidden',
                style({
                    height: '0',
                    opacity: '0',
                    overflow: 'hidden',
                    padding: '0',
                    margin: '0',
                })
            ),
            transition('hidden <=> shown', animate('0.25s')),
            transition('hidden <=> shown', animate('0.25s')),
        ]),
    ],
})
export class LangSwitcherComponent implements OnInit {
    @ViewChild('langSelect') langSelect: ElementRef;
    @Input('typeSelect') typeSelect: string;
    @Input() authClass;
    @Input() langSwitch: string = '';
    // langList: any;
    langList: LanguageModel[] = [];

    selectType = 'home';

    currentLang: any;

    openSelect: boolean = true;
    showDropdownPanel: boolean = false;
    is_openMibileLangList: boolean = false;

    constructor(
        public hiddenMenuService: HiddenMenuService,
        private swipeService: SwipeService,
        private languageService: LanguageService,
        private langService: LangService
    ) {
        this.langList = languageService.languageList;
        this.currentLang = this.langList.find(
            (itm) => itm.code === this.langService.lang
        );
    }

    ngOnInit(): void {
        this.swipeService.isSwipeChange.subscribe(() => {
            if (
                this.swipeService.swipeSide === 'left' &&
                this.hiddenMenuService.name === 'menu_lang'
            ) {
                this.closeMenuLang();
            }
            if (
                this.swipeService.swipeSide === 'left' &&
                this.hiddenMenuService.subMenuName === 'menu_lang'
            ) {
                this.closeAccountMenuLang();
            }
        });
    }


    setLang(lang) {
        this.langService.setLang(lang.code);
        // this.showDropdownPanel = false;
        // this.currentLang = [...this.langList].filter(
        //     (item) => item.code === code
        // )[0];
        this.currentLang = lang;
        this.closeAccountMenuLang();
        this.closeMenuLang();
    }

    getOpenSelect(e, open: boolean) {
        // if (open) {
        //     // this.openSelect = true;
        //     this.showDropdownPanel = true;
        // } else {
        //     this.showDropdownPanel = false;
        // }
    }

    openMenuLang() {
        this.hiddenMenuService.open('menu_lang');
    }

    openAccountMenuLang() {
        this.hiddenMenuService.openSubMenu('menu_lang');
    }

    closeMenuLang() {
        this.hiddenMenuService.close();
    }

    closeAccountMenuLang() {
        this.hiddenMenuService.closeSubMenu();
    }
}
