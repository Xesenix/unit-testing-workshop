import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { tap, switchMap, shareReplay } from 'rxjs/operators';

export interface IUser {
  id: string;
  session: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  public onUserLogsIn$ = new Subject();

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * How would you test if it correctly works with valid invalid and error response?
   */
  public authenticate(user: string, password: string) {
    return this.http.post<IUser>('{apiEndpoint}/auth', { user, password }).pipe(
      tap((identity: IUser) => this.onUserLogsIn$.next(identity)),
    )
  }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * how would you test if correct user data are in pipe?
   */
  public loggedInUser$ = this.sessionService.onUserLogsIn$.pipe(
    shareReplay(1),
  );

  constructor(
    private sessionService: SessionService,
  ) {}
}

@Injectable({ providedIn: 'root' })
export class RedirectionService {
  private redirectionPath: string | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {
    this.sessionService.onUserLogsIn$.subscribe(() => {
      if (this.redirectionPath) {
        this.router.navigateByUrl(this.redirectionPath)
      }
    });
  }

  /**
   * how would you test that redirection works correctly?
   */
  public setRedirection(path: string) {
    this.redirectionPath = path;
  }
}