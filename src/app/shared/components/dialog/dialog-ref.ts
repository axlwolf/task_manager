import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * A reference to a dialog. Used to control the dialog from the component that opened it.
 */
@Injectable()
export class DialogRef {
  private readonly _afterClosed = new Subject<any>();
  private _result: any;

  /** Gets an observable that emits when the dialog has been closed. */
  afterClosed$ = this._afterClosed.asObservable();

  /**
   * Closes the dialog with an optional result.
   * @param result The result to return to the dialog opener.
   */
  close(result?: any): void {
    this._result = result;
    this._afterClosed.next(result);
    this._afterClosed.complete();
  }

  /**
   * Gets the result returned by the dialog.
   */
  getResult(): any {
    return this._result;
  }
}
