import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class HiddenMenuService {
    name: string;
    data: any;
    subMenuName: string;

    openEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(private matDialog: MatDialog) {}

    public open(name: string, data?: any): void {
        this.matDialog.closeAll();
        document.querySelector('body')!.style.overflow = 'hidden';
        document.querySelector('body')!.style.paddingRight =
            this.getScrollbarWidth() + 'px';
        this.name = name;
        this.data = data;
        this.subMenuName = '';
        this.openEvent.emit();
    }

    public close(): void {
        document.querySelector('body')!.style.overflow = 'initial';
        document.querySelector('body')!.style.paddingRight = '0';
        this.name = '';
        this.data = null;
    }

    public openSubMenu(name: string): void {
        this.subMenuName = name;
    }

    public closeSubMenu(): void {
        this.subMenuName = '';
    }

    public get modalName(): string {
        return this.name;
    }

    getScrollbarWidth() {
        // Creating invisible container
        const outer: any = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll'; // forcing scrollbar to appear
        outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
        document.body.appendChild(outer);

        // Creating inner element and placing it in the container
        const inner = document.createElement('div');
        outer.appendChild(inner);

        // Calculating difference between container's full width and the child width
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

        // Removing temporary elements from the DOM
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }
}
