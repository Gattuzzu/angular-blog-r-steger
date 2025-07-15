import { Injectable } from '@angular/core';

export enum Operation {
  Plus = 'Plus',
  Minus = 'Minus',
  Multiplizieren = 'Multiplizieren',
  Dividieren = 'Dividieren',
}

@Injectable({
  providedIn: 'root',
})
export class OperationService {}
