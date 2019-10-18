import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { RoutingTestingModule } from '../testing/routing.module';
import { navigateTo, authenticationHelper } from '../testing/utils';
import { SessionServiceMock } from '../testing/mocks/session';
import { UserServiceMock } from '../testing/mocks/user';

import { SessionService, RedirectionService, UserService, IUser } from './practice';

describe('practice', () => {

  describe('SessionService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RoutingTestingModule,
          HttpClientTestingModule,
        ],
        providers: [
          SessionService,
        ],
      });
    });

    describe('authenticate', () => {
      it('should request authentication from api endpoint', fakeAsync(inject([
        SessionService,
        HttpTestingController,
      ], (
        service: SessionService,
        httpMock: HttpTestingController,
      ) => {
        // Arrange
        let result: any = 'no one expects spanish inquisition';
        const user = { id: 'some-guy', session: 'backend-session-x' };
        const username = 'username';
        const password = 'p4ssW0rD';

        // Act
        service.authenticate(username, password).subscribe(data => result = data);

        // Assert
        const mock = httpMock.expectOne('{apiEndpoint}/auth');

        expect(mock.request.method).toEqual('POST');
        expect(mock.request.body).toEqual({ user: username, password });

        mock.flush(user);
        tick();

        expect(result).toEqual(user);
      })));
    })
  });

  xdescribe('UserService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RoutingTestingModule,
        ],
        providers: [
          UserService,
          {
            provide: SessionService,
            useClass: SessionServiceMock,
          },
        ],
      });
    });

    describe('loggedInUser$', () => {
      it('should return correct user', inject([
        SessionService,
      ], (
        sessionService: SessionServiceMock,
      ) => {
        // Arrange
        const a = { id: 'some-guy', session: 'backend-session-1' };
        const b = { id: 'some-other-guy', session: 'backend-session-2' };
        const expected$ = cold('------x---b', { a, b, x: null })
        // we want to check if it doesnt replays value `a` that was signal before userService
        // connected to sessionService and then if it correctly reacts to signals that ocure after subscribtion
        sessionService.useStream(hot('--a-^-----x---b', { a, b, x: null }));

        // Act
        // sometimes we want test some logic that is in constructor in those cases we need to inject tested
        // service after we setup context
        const service = TestBed.get(UserService);

        // Assert
        expect(service.loggedInUser$).toBeObservable(expected$);
      }));
    });
  });

  describe('RedirectionService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          RoutingTestingModule,
        ],
        providers: [
          RedirectionService,
          {
            provide: SessionService,
            useClass: SessionServiceMock,
          },
        ],
      });
    });

    describe('when redirection is set', () => {
      // Arrange - this part may occure outside of unit test
      let redirectionPath: string;
      beforeEach(inject([
        RedirectionService,
      ], (
        service: RedirectionService,
      ) => {
        // we need to setup it in before each as in some cases prevous test could have changed its value
        redirectionPath = '/redirect/url';
        service.setRedirection(redirectionPath);
      }));

      it('should redirect to redirect/url after new user logs in', inject([
        RedirectionService,
        Location,
      ], async (
        service: RedirectionService,
        ngLocation: SpyLocation,
      ) => {
        // Arrange - more specific parts of preparing test still can be inside unit test
        const user = { id: 'some-guy', session: 'backend-session-1' };
        const basePath = '/home';

        // move to some existing url 
        await navigateTo(basePath);

        // Act
        await authenticationHelper(user);

        // Assert
        expect(ngLocation.path()).toBe(redirectionPath, 'after authentication');
      }));
    });

    describe('when redirection is not set', () => {
      it('should not change url after new user logs in', inject([
        RedirectionService,
        Location,
      ], async (
        service: RedirectionService,
        ngLocation: SpyLocation,
      ) => {
        // Arrange - more specific parts of preparing test still can be inside unit test
        const user = { id: 'some-guy', session: 'backend-session-2' };
        const basePath = '/home';

        // move to some existing url 
        await navigateTo(basePath);

        // Act
        await authenticationHelper(user);

        // Assert
        expect(ngLocation.path()).toBe(basePath, 'after authentication');
      }));
    });
  });
});