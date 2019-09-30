import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertComponent } from './alert/alert.component';

@NgModule({
    declarations: [
        TableComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule
    ],
    exports: [
        TableComponent,
        AlertComponent
    ]
})
export class AppCommonModule { }
