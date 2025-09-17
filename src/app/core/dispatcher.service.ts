import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ActionType {
  SET_UPLOADING_STATE = 'SET_UPLOADING_STATE',
  SET_UPLOADING_ERROR_STATE = 'SET_UPLOADING_ERROR_STATE',
  // SET_ACT_PAGE_STATE = 'SET_ACT_PAGE_STATE',
  // SET_LOADING_STATE = 'SET_LOADING_STATE',
}

export interface Action<T> {
  type: ActionType;
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class Dispatcher {
  private readonly dispatcherQueue = new Subject<Action<unknown>>();

  // Auf diese aktionen höhren die Subsriber auf die Meldungen
  public readonly action = this.dispatcherQueue.asObservable();

  // Mit dieser Methode melden Komponenten neue Werte
  dispatch<T>(action: Action<T>): void {
    console.log('Action dispatched: ', action.type);
    this.dispatcherQueue.next(action);
  }
}
