import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { CartService } from '../../pages/cart/cart.service/CartService';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<{ nombre: string; rol: string; id:number } | null>(null);
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  readonly user = this._user.asReadonly();

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const userData = JSON.parse(saved);
      this._user.set(userData);
      this.cartService.setUsuario(userData.id);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/login', credentials).pipe(
      tap(response => {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const userData = { nombre: payload.sub, rol: payload.rol, id: payload.id };

        this._user.set(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('token', response.token);

        this.cartService.setUsuario(userData.id);
        
      })
    );
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.cartService.setUsuario(null);
  }

  register(body: { username: string; email: string; nombreCompleto: string; telefono: string; password: string; }): Observable<any> {
    return this.http.post<any>('http://localhost:8080/auth/register', body);
  }
}
