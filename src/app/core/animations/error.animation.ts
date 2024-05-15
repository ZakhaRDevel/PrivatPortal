import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export function ErrorAnimation() {
    return trigger('error', [
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
    ]);
}
