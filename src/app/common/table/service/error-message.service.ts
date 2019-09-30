import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ErrorMessageService {
    
    constructor() {}
    
    tryParseErrorMessage(errorResponse: any): string {
        
        if (!errorResponse) {
            return null;
        }
        
        if (!errorResponse.error) {
            return null;
        }
        
        return !!errorResponse.error.message 
            ? errorResponse.error.message 
            : 'unknown error';
    }
}