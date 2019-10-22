import { NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { Router } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { createScheduler } from 'rxjs/testing';
import { map, tap, switchMap } from 'rxjs/operators';

import { RoutingTestingModule } from '../testing/routing.module';
import { navigateTo } from '../testing/utils';

describe('examples', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RoutingTestingModule, // our custom testing module
        HttpClientTestingModule, // angular testing module that provides mocking for http connections
        ApolloTestingModule, // similar to HttpClientTestingModule but for graphql requests
      ],
    });
  })

  describe('navigation', () => {
    // when working with navigation we need to wait for it to finish
    // we can do it either with async await
    // or fakeAsync tick

    it('should navigate to home with async await', inject([
      Router,
      Location,
    ], async (
      router: Router, // this part probably will be used somwhere in tested service or coponent
      ngLocation: SpyLocation, // this part will help us in testing
    ) => {
      // Arrange
      const path = '/home';
      
      // Act
      await navigateTo(path);

      // Assert
      expect(ngLocation.path()).toBe(path, 'after navigation'); 
    }));


    it('should navigate to home with fakeAsync tick', fakeAsync(inject([
      Router,
      Location,
    ], (
      router: Router, // this part probably will be used somwhere in tested service or coponent
      ngLocation: SpyLocation // this part will help us in testing
    ) => {
      // Arrange
      const path = '/home';
      
      // Act
      navigateTo(path);
      tick();

      // Assert
      expect(ngLocation.path()).toBe(path, 'after navigation'); 
    })));
  });

  describe('http communication', () => {
    describe('plain', () => {
      it('should request data from server', fakeAsync(inject([
        HttpClient,
        HttpTestingController,
      ], (
        httpClient: HttpClient, // this part probably will be used somwhere in tested service or coponent
        httpMock: HttpTestingController, // this part will help us in testing
      ) => {
        // Arrange
        let result: any = 'no one expects spanish inquisition';
        const path = '{apiEndpoint}/home';
        const data = { some: 'data' };
        const expected = { ...data, wasProcessed: true };

        // Act
        httpClient.get(path)
          // something may modify returned server result
          .pipe(map((data) => Object.assign(data, { wasProcessed: true })))
          // but we just care about what we get in the end
          .subscribe((data) => result = data)

        // Assert
        httpMock.expectOne(path).flush(data);
        tick();

        expect(result).toEqual(expected); // after processing server response
        // check if there arent any other not handled requests
        httpMock.verify();
      })));
    });

    describe('with marbles', () => {
      it('should request data from server', inject([
        HttpClient,
        HttpTestingController,
      ], (
        httpClient: HttpClient, // this part probably will be used somwhere in tested service or coponent
        httpMock: HttpTestingController, // this part will help us in testing
      ) => {
        // Arrange
        const path = '{apiEndpoint}/home';
        const data = { some: 'data' };
        const expected = { ...data, wasProcessed: true };
        const result$ = httpClient.get(path)
          // something may modify returned server result
          .pipe(map((data) => Object.assign(data, { wasProcessed: true })))

        // Act
        // sometimes we may need to call some function in same context that
        // marbles are working we can use this trick for it
        cold('---a|', { a: true }).subscribe(() => httpMock.expectOne(path).flush(data));

        // Assert
        expect(result$).toBeObservable(cold('---(a|)', { a: expected })); // after processing server response
      }));
    });
  });

  // @see https://www.apollographql.com/docs/angular/guides/testing/
  describe('graphql', () => {
    const GET_BEER_QUERY = gql`
  query getBeer($name: String) {
    beer(name: $name) {
      id
      name
      taste
    }
  }
`;

    describe('plain', () => {
      it('should request data from server', fakeAsync(inject([
        Apollo,
        ApolloTestingController,
      ], (
        apollo: Apollo, // this part probably will be used somwhere in tested service or coponent
        apolloMock: ApolloTestingController, // this part will help us in testing
      ) => {
        // Arrange
        let result: any = 'no one expects spanish inquisition';
        const path = '{apiEndpoint}/home';
        const data = {
          data: {
            beer: {
              id: 0,
              name: 'Mr Apollo',
              taste: 'awful',
            },
          },
        };
        const expected = { ...data.data };

        // Act
        apollo.query({
          query: GET_BEER_QUERY,
        }).subscribe(({ data }) => result = data);

        // Assert
        apolloMock.expectOne(GET_BEER_QUERY).flush(data);
        tick();

        expect(result).toEqual(expected); // after processing server response
        // check if there arent any other not handled requests
        apolloMock.verify();
      })));
    });
  });

  // @see https://medium.com/@bencabanes/marble-testing-observable-introduction-1f5ad39231c
  // @see https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing
  describe('marbles', () => {
    it('should work', () => {
      // Arrange
      const expected = {
        type: 'TECHNICAL',
        level: 'ERROR',
        msg: 'test'
      };

      const expected$ = cold('(a|)', { a: expected });

      // Act
      const result$ = of(expected);

      // Assert
      expect(result$).toBeObservable(expected$);
    });

    it('should throw error', fakeAsync(() => {
      // Arrange
      const error = 'boom';
      // this one is very tricky for some reasons it doesnt work for any time value
      const expected$ = cold('500ms #', null, error);

      // Act
      const result$ = cold('500ms 1').pipe(switchMap(() => throwError(error)));

      // Assert
      expect(result$).toBeObservable(expected$);
    }));
  });

  // @see https://dev.to/mokkapps/how-to-easily-write-and-debug-rxjs-marble-tests-55jc
  describe('rx-sandbox', () => {

  });
});