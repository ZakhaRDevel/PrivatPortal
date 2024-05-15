import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { QuestionnareComponent } from './questionnare.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';
import { QuestionnareResolver } from 'src/app/data/resolvers/questionnare.resolver';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';

const routes: Routes = [
    {
        path: '',
        component: QuestionnareComponent,
        resolve: {
            page: PageResolver,
        },
        data: {
            slug: 'questionnare',
            additions: ['errors'],
        },
        children: [
            {
                path: '',
                component: StepOneComponent,
                resolve: {
                    me: QuestionnareResolver,
                },
                data: {
                    step: 1,
                },
            },
            {
                path: 'step-two',
                component: StepTwoComponent,
                resolve: {
                    me: QuestionnareResolver,
                },
                data: {
                    step: 2,
                },
            },
            {
                path: 'step-three',
                component: StepThreeComponent,
                resolve: {
                    me: QuestionnareResolver,
                },
                data: {
                    step: 3,
                },
            },
            {
                path: 'step-four',
                component: StepFourComponent,
                resolve: {
                    me: QuestionnareResolver,
                },
                data: {
                    step: 4,
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuestionnareRoutingModule {}
