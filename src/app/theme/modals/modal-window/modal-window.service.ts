import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalWindowService {
    private modals: any[] = [];

    modalId = null;

    add(modal: any): void {
        this.modals.push(modal);
    }

    remove(id: string): void {
        this.modals = this.modals.filter((x) => x.id !== id);
    }

    open(id: string): void {
        const modal = this.modals.find((x) => x.id === id);
        if (modal) {
            modal.open();
            this.modalId = id;
        }
    }

    close(id: string): void {
        const modal = this.modals.find((x) => x.id === id);
        modal.close();
        this.modalId = null;
    }
}
