import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly user$: Observable<any>;

  constructor() {
    this.user$ = of(true);
  }

  public login(email: string, password: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public register(email: string, password: string, code: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
