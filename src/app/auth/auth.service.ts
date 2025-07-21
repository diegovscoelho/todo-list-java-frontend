// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt'; // Para decodificar JWTs
import { environment } from '../../environments/environment';

// Interface para o objeto de resposta de login (ajuste conforme seu backend)
interface LoginResponse {
  token: string;
  // Outros dados, como user role, user id, etc.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.backendUrl + '/auth/login';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    // Remover outros dados do usuário se armazenados
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    // Verifica se o token existe e se não está expirado
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Opcional: Para obter informações do payload do JWT
  getDecodedToken(): any | null {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }
}