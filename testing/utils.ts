import { NgZone } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SessionService, UserService, IUser } from '../unit-tests/practice';

import { SessionServiceMock } from './mocks/session';
import { UserServiceMock } from './mocks/user';

/**
 * we can create helper function that can be reused between tests
 * also notice that we can use inject to inject dependencies
 *
 * keep in mind you can only use those helper when testing modules which have all
 * injected mocks provided in them
 *
 * @param user simulated server response already handled by SessionService
 */
export const authenticationHelper = (user: IUser) =>
  inject(
    [SessionService, UserService],
    (sessionService: SessionServiceMock, userService: UserServiceMock) => {
      sessionService.onUserLogsIn$.next(user);
      userService.loggedInUser$.next(user);
    }
  )();

/**
 * if we use plain navigation inside angular testing without ng zone we will get warnings
 * about running navigation outside of angular zone this is one of methods that can prevent it
 */
export const navigateTo = (path: string) =>
  inject([Router, NgZone], (router: Router, zone: NgZone) =>
    zone.run(() => router.navigateByUrl(path))
  )();
