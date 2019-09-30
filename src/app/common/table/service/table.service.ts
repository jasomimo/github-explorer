import { Injectable } from '@angular/core';

export interface NavLinks {
    first: string,
    previous: string,
    next: string,
    last: string
}

@Injectable({providedIn: 'root'})
export class TableService {
    
    constructor() {}
    
    private maxRecordsCount = 1000;
    
    getLastPage(totalRecords: number, pageSize: number): number {
        
        const maxPageSize = Math.ceil(this.maxRecordsCount / pageSize);
        
        // GitHub provides only first 1000 records, so max page number can be 100 with 10 being page size
        return totalRecords > this.maxRecordsCount 
            ? maxPageSize
            : Math.ceil(totalRecords / pageSize);
    }
    
    getNavLinksFromHeader(headerNavLinks: string): NavLinks {
        
        const navLinks:NavLinks = {
            first: null,
            previous: null,
            next: null,
            last: null
        }
        
        if (!headerNavLinks) {
            return navLinks;
        }
        
        const linksItems = headerNavLinks.split(',');
        
        if (linksItems.length === 0) {
            return navLinks;
        }
        
        for (const linkItem of linksItems) {
            
            if (linkItem.indexOf('rel="first"') !== -1) {
                
                navLinks.first = this.getNavLink(linkItem);
            }
            
            if (linkItem.indexOf('rel="prev"') !== -1) {
                
                navLinks.previous = this.getNavLink(linkItem);
            }
            
            if (linkItem.indexOf('rel="next"') !== -1) {
                
                navLinks.next = this.getNavLink(linkItem);
            }
            
            if (linkItem.indexOf('rel="last"') !== -1) {
                
                navLinks.last = this.getNavLink(linkItem);
            }
        }
        
        return navLinks;
    }
    
    private getNavLink(linkItem: string):string {
        
        let link = linkItem.split(';')[0];
        link = link.replace('<', '').replace('>', '');
        
        return link;
    }
}