import { Component, OnInit } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';

@Component({
    selector: 'app-giveaways',
    templateUrl: './giveaways.component.html',
    styleUrls: ['./giveaways.component.scss'],
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
        trigger('modal', [
            transition('void => *', [
                style({ transform: 'scale3d(.3, .3, .3)' }),
                animate(200),
            ]),
            transition('* => void', [
                animate(200, style({ transform: 'scale3d(.0, .0, .0)' })),
            ]),
        ]),
    ],
})
export class GiveawaysComponent implements OnInit {
    constructor(private hiddenMenuService: HiddenMenuService) {}

    ngOnInit(): void {
        this.hiddenMenuService.close();
    }
}
