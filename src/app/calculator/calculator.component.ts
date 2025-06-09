import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Operation } from '../operation.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatInputModule, MatSelectModule, FormsModule, MatButtonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  public operation = Operation;

  public selectedOperation: Operation = Operation.Plus;

  public numberA = 0;
  public numberB = 0;
  public result = 0;

  public get operations(): string[] {
    return Object.values(Operation);
  }

  public calcResult(): void {
    console.log(
      'Calculation: ' +
        this.numberA +
        ' ' +
        this.selectedOperation +
        ' ' +
        this.numberB,
    );

    switch (this.selectedOperation) {
      case Operation.Plus:
        this.result = Number(this.numberA) + Number(this.numberB);
        break;
      case Operation.Minus:
        this.result = this.numberA - this.numberB;
        break;
      case Operation.Multiplizieren:
        this.result = this.numberA * this.numberB;
        break;
      case Operation.Dividieren:
        this.result = this.numberB !== 0 ? this.numberA / this.numberB : NaN;
        break;
    }
  }
}
