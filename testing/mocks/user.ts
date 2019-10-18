
import { ReplaySubject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

import { IUser } from '../unit-tests/practice';

@Injectable({ providedIn: 'root' })
export class UserServiceMock {
  /**
   * It is important to use proper kind of Subjet vs Replay subject to correctly simulate
   * behaviour of original observable used for implementation (but I didnt found good way to enforce it yet)
   */
  public loggedInUser$ = new ReplaySubject<IUser>(1);
}