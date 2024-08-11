import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
//todo: Complete missing code..{
  {
    private tokenKey = 'authToken';
    constructor() { }
    getToken(): string | null {
      return localStorage.getItem(this.tokenKey);
    }
    setToken(token: string): void {
      localStorage.setItem(this.tokenKey, token);
    }
    removeToken(): void {
      localStorage.removeItem(this.tokenKey);
    }
    isAuthenticated(): boolean {
      return !!this.getToken();
    }
  }