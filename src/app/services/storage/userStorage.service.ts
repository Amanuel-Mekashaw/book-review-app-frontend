// user storage sevice

import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import CryptoJS from 'crypto-js';

const ID = 'customer-id';
const CUSTOMER = 'customer';
const TOKEN = 'token';
const USERNAME = 'customer-username';
const ROLES = 'customer-roles';

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
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.setItem(TOKEN, this.encryptData(token));
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

  // Save the id
  public saveCustomerId(customerId: number): void {
    window.sessionStorage.removeItem(ID);
    window.sessionStorage.setItem(ID, this.encryptData(customerId));
  }

  // retrieve the id
  public getCustomerId(): number {
    const encryptedId = window.sessionStorage.getItem(ID);
    return encryptedId ? this.decryptData(encryptedId) : null;
  }

  // save the customer data
  public saveCustomerData(customerData: any): void {
    window.sessionStorage.removeItem(CUSTOMER);
    window.sessionStorage.setItem(CUSTOMER, this.encryptData(customerData));
  }

  // Retrieve customer data
  public getCustomerData(): any {
    const encryptedCustomerData = window.sessionStorage.getItem(CUSTOMER);
    return encryptedCustomerData
      ? this.decryptData(encryptedCustomerData)
      : null;
  }

  // Save the username
  public saveCustomerUserName(username: string): void {
    window.sessionStorage.removeItem(USERNAME);
    window.sessionStorage.setItem(USERNAME, this.encryptData(username));
  }

  // Retrieve the username
  public getCustomerUserName(): string | null {
    const encryptedUsername = window.sessionStorage.getItem(USERNAME);

    return encryptedUsername ? this.decryptData(encryptedUsername) : null;
  }

  // Save roles as an array of strings
  public saveRoles(roles: Array<string>): void {
    window.sessionStorage.removeItem(ROLES);
    window.sessionStorage.setItem(ROLES, this.encryptData(roles));
  }

  // Retrieve roles as an array of strings
  public getRoles(): Array<string> {
    const encryptedRoles = window.sessionStorage.getItem(ROLES);
    return encryptedRoles ? this.decryptData(encryptedRoles) : [];
  }

  // check if the logged in customer is admin
  public isAdminLoggedIn(): boolean {
    if (this.getToken === null) {
      return false;
    }
    const roles = this.getRoles();

    return roles.includes('ADMIN');
  }
  // check if the logged in customer is user
  public isCustomerLoggedIn(): boolean {
    if (this.getToken === null) {
      return false;
    }
    const roles = this.getRoles();

    return roles.includes('USER');
  }

  // Clear all stored values (useful for logout)
  public clearStorage(): void {
    window.sessionStorage.removeItem(TOKEN);
    window.sessionStorage.removeItem(USERNAME);
    window.sessionStorage.removeItem(ROLES);
    window.sessionStorage.removeItem(CUSTOMER);
    window.sessionStorage.removeItem(ID);
  }
}
