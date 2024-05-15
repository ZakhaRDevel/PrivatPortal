import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import SignClient from '@walletconnect/sign-client';
// import QRCodeModal from '@walletconnect/qrcode-modal';
// import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-modal-wallet-connect',
    templateUrl: './modal-wallet-connect.component.html',
    styleUrls: ['./modal-wallet-connect.component.scss'],
    animations: [
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class ModalWalletConnectComponent implements OnInit {
    constructor(
        private matDialogRef: MatDialogRef<ModalWalletConnectComponent>,
        private authService: AuthService,
        private langService: LangService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
        }
    ) {}

    ngOnInit(): void {}

    close() {
        this.matDialogRef.close();
    }

    auth(signature: string, type: string) {
        this.authService
            .loginWallet({
                signature,
                type: type,
                locale: this.langService.lang,
            })
            .subscribe(
                () => {
                    this.matDialogRef.close(true);
                },
                (error: HttpErrorResponse) => {
                    // alert(error.error.message);
                    this.openFailedConfirmModal();
                }
            );
    }

    async metamskAuth() {
        const signature = await this.authService.createSignature(
            `Auth-PrivatPortal.com:${Date.now()}`
        );

        this.auth(signature, 'metamask');
    }

    async walletConnectAuth() {
        const signClient = await SignClient.init({
            projectId: 'af896cffef02bf85dfc971ece3262d45',
            metadata: {
                name: 'PrivatClub',
                description: 'PrivatClub',
                url: window.location.origin,
                icons: ['https://walletconnect.com/walletconnect-logo.png'],
            },
        });

        try {
            const { uri, approval } = await signClient.connect({
                requiredNamespaces: {
                    eip155: {
                        methods: ['personal_sign'],
                        chains: ['eip155:1'],
                        events: ['chainChanged', 'accountsChanged'],
                    },
                },
            });

            if (uri) {
                QRCodeModal.open(uri, () => {});
            }

            const session = await approval();

            await this.timeout(1000);

            await this.connect(signClient, session);
        } catch (e) {
            console.error(e);
        } finally {
            QRCodeModal.close();
        }
    }

    async connect(signClient, session) {
        const acc = session.namespaces.eip155.accounts[0].replace(
            'eip155:1:',
            ''
        );

        const message = `0x${this.toHex(`Auth-PVTCLUB:${Date.now()}`)}`;

        const signature = await signClient.request({
            topic: session.topic,
            chainId: 'eip155:1',
            request: {
                id: 1,
                jsonrpc: '2.0',
                method: 'personal_sign',
                params: [message, acc],
            },
        });

        this.auth(btoa(`${signature}@${acc}@${message}`), 'walletconnect');
    }

    private toHex(stringToConvert: string) {
        return stringToConvert
            .split('')
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
    }

    async timeout(ms: number): Promise<any> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    openFailedConfirmModal() {
        this.matDialogRef.close();
        this.matDialog.open(AuthModalComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass: 'form-dialog-container',
            data: {
                title: this.data.page.data.modalErrorWalletConnectTitle,
                text: this.data.page.data.modalErrorWalletConnectText,
                img_url: '/assets/img/pages/auth/wallet_error.png',
                btn_text: this.data.page.data.modalErrorWalletConnectBtnText,
            },
        });
    }
}
