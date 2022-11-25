import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

import { AComponent } from './component';

describe('AComponent', () => {
  let component: AComponent;
  let fixture: ComponentFixture<AComponent>;
  let button: DebugElement;
  let matButton: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressButtonsModule],
      declarations: [AComponent],
    });

    // create component and test fixture
    fixture = TestBed.createComponent(AComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    button = fixture.debugElement.query(By.css('button'));
    matButton = fixture.debugElement.query(By.css('mat-spinner-button'));
  });

  it('should click button', inject([], () => {
    const spy = spyOn(component, 'someFunc');
    // This sync emits the event and the subscribe callback gets executed above
    button.triggerEventHandler('click', null);

    expect(button).toBeDefined();

    expect(spy).toHaveBeenCalled();
  }));

  it('should click mat-spinner-button', inject([], () => {
    const spy = spyOn(component, 'someFunc');
    // This sync emits the event and the subscribe callback gets executed above
    matButton.triggerEventHandler('btnClick', null);

    expect(matButton).toBeDefined();

    expect(spy).toHaveBeenCalled();
  }));
});
