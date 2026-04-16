import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<{ nombre: string; rol: string } | null>(null);
  private http = inject(HttpClient);

  readonly user = this._user.asReadonly();

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) this._user.set(JSON.parse(saved));
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/login', credentials).pipe(
      tap(response => {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const userData = { nombre: payload.sub, rol: payload.rol };

        this._user.set(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData)); 
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }
}
