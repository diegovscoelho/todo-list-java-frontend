// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Para decodificar JWTs
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string; 
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.backendUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/users/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);

        localStorage.setItem('user_data', JSON.stringify({
          id: response.id,
          username: response.username,
          email: response.email
        }));
      })
    );
  }

  register(username: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/api/users/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }
}