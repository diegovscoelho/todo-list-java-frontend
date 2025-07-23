// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Para decodificar JWTs
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
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

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
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