import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {

    @Input() alertTitle: string;
    @Input() alertMessage: string;

    @Output() close = new EventEmitter<void>();

    constructor() { }

    onClose() {
        this.close.emit();
    }
}
