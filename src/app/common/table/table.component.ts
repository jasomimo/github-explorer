import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Table, RowItemType, NavigationPage, RowItemLink, SortParams } from './model/table.model';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

    @Input() table: Table;
    @Output() navigation = new EventEmitter<NavigationPage>();
    @Output() sort = new EventEmitter<SortParams>();
    
    // enums
    rowItemType = RowItemType;
    naviationItem = NavigationPage;
    
    trueIcon = faCheck;
    falseIcon = faTimes;
    
    constructor() {}

    ngOnInit() {}
    
    onPageChange(navPage:NavigationPage) {
        this.navigation.emit(navPage);
    }
    
    isInternalLink(rowItem: RowItemLink): boolean {
        return rowItem.link.startsWith('/');
    }
    
    getLinkTarget(rowItem: RowItemLink): string {
        return rowItem.targetBlank ? '_blank' : '_self';
    }
    
    sortBy(columnId: string): void {
        
        const columnIsSortable = this.table.columns.find(column => column.id === columnId && column.sortable);
        
        if (!columnIsSortable) {
            return;
        }
        
        if (this.table.sortBy === columnId) {
            // change ascending order for current column
            this.sort.emit({sortBy: columnId, sortAscending: !this.table.sortAscending});
        }
        else {
            // sort by different column and keep sort order
            this.sort.emit({sortBy: columnId, sortAscending: this.table.sortAscending})
        }
    }

}
