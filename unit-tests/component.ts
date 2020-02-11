import { Component } from '@angular/core';
import { MatProgressButtonOptions } from 'mat-progress-buttons'

@Component({
  selector: 'a-component',
  templateUrl: './component.html',
  styleUrls: []
})
export class AComponent {
  spinnerButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Spinner Button',
    spinnerSize: 18,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
    buttonIcon: {
      fontIcon: 'favorite'
    }
  }

  public someFunc() {

  }
}