
import { Subject } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';

import { IUser } from '../unit-tests/practice';

@Injectable({ providedIn: 'root' })
export class SessionServiceMock {
  /**
   * It is important to use proper kind of Subjet vs Replay subject to correctly simulate
   * behaviour of original observable used for implementation (but I didnt found good way to enforce it yet)
   */
  public onUserLogsIn$ = new Subject<IUser>();

  /**
   * We can create additional helper methods on mocked services this one isnt part of public api for
   * SessionService but can be used for testing.
   */
  public useStream(observable$) {
    this.onUserLogsIn$ = observable$;
  }
}