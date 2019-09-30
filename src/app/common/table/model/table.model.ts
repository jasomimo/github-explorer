// column
export interface Column {
    id: string,
    label: string,
    sortable: boolean
}

export enum RowItemType {
    Image,
    Date,
    Link,
    Number,
    Boolean
}

export enum NavigationPage {
    First,
    Previous,
    Next,
    Last
}

interface RowItem {
    readonly type: RowItemType,
    readonly columnId: string,
}

export class RowItemImage implements RowItem {
    
    public readonly type: RowItemType;
    
    constructor(public readonly columnId:string,
                public readonly imageUrl:string, 
                public readonly alt:string) {
                    
        this.type = RowItemType.Image;
    }
}

export class RowItemDate implements RowItem {
    
    public readonly type: RowItemType;
    
    constructor(public readonly columnId:string,
                public readonly date: Date) {
                    
        this.type = RowItemType.Date;
    }
}

export class RowItemLink implements RowItem {
    
    public readonly type: RowItemType;
    
    constructor(public readonly columnId:string,
                public readonly value:string, 
                public readonly link:string,
                public readonly targetBlank: boolean) {
                    
        this.type = RowItemType.Link;
    }
}

export class RowItemNumber implements RowItem {
    
    public readonly type: RowItemType;
    
    constructor(public readonly columnId:string,
                public readonly number: number) {
                    
        this.type = RowItemType.Number;
    }
}

export class RowItemBoolean implements RowItem {
    
    public readonly type: RowItemType;
    
    constructor(public readonly columnId:string,
                public readonly boolean: boolean) {
                    
        this.type = RowItemType.Boolean;
    }
}

export interface Row {
    id: number,
    rowItems: RowItem[]
}

export interface Table {
    currentPage: number,
    pageSize: number,
    sortBy: string,
    sortAscending: boolean,
    totalRecords: number,
    currentUrl: string,
    firstUrl: string,
    previousUrl: string,
    nextUrl: string,
    lastUrl: string,
    columns: Column[],
    rows: Row[]
}

export interface TableData {
    currentUrl: string,
    currentPage: number,
    pageSize: number,
    totalRecords: number,
    sortBy: string,
    sortAscending: boolean
}

export interface SortParams {
    sortBy: string,
    sortAscending: boolean
}

export const defaultPageSize = 10;
export const defaultCurrentPage = 1;

export class AppTable implements Table {
    
    constructor(public columns: Column[], 
                public rows: Row[], 
                public currentUrl: string,
                public totalRecords: number,
                public currentPage: number, 
                public pageSize: number,
                public firstUrl: string,
                public previousUrl: string,
                public nextUrl: string,
                public lastUrl: string,
                public sortBy: string,
                public sortAscending: boolean) {
        
        if (!columns) {
            throw Error('AppTable is missing columns.');
        }
        
        if (!rows) {
            throw Error('AppTable is missing rows.');
        }
    }
}