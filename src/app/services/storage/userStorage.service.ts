// user storage sevice

import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

const USERSIGNAL = 'userSignal';
const USERDETAILS = 'userDetails';
const TOKEN = 'token';
// Use a secret key for encryption. This key must be kept secure.
const SECRET_KEY = 'my-secret-key';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}

  // Encrypt data
  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  }

  // Decrypt data
  private decryptData(data: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Save the JWT token
  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN);
    localStorage.setItem(TOKEN, this.encryptData(token));
  }

  // Retrieve the JWT token
  public getToken(): string | null {
    const encryptedToken = window.localStorage.getItem(TOKEN);

    return encryptedToken ? this.decryptData(encryptedToken) : null;
  }
  // Decode the JWT token to get the payload
  private decodeToken(token: string): any {
    try {
      return jwtDecode(token); // Decode the token to access the payload
    } catch (error) {
      return null;
    }
  }

  // Check if the JWT token is expired
  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const decodedToken = this.decodeToken(token);
    if (!decodedToken || !decodedToken.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decodedToken.exp < currentTime; // Compare expiration time with current time
  }

  // Clear all stored values (useful for logout)
  public clearStorage(): void {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USERDETAILS);
    localStorage.removeItem(USERSIGNAL);
  }
}
