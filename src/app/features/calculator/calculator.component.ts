import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Operation } from '../../core/service/calculator/operation.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export default class CalculatorComponent {
  @Input() isSpecial = false;
  @Output() messageEvent = new EventEmitter<string>();

  translateService = inject(TranslateService);

  public selected = '';
  public operation = Operation;
  public newText = '';
  public actText = '';
  public isLongText = false;

  public selectedOperation: Operation = Operation.Plus;

  public numberA = 0;
  public numberB = 0;
  public result = 0;

  public sendMessage() {
    this.messageEvent.emit('Aktive Funktion: ' + this.selected);
  }

  public setText() {
    this.actText = this.newText;
    this.isLongText = this.actText.length >= 10;
  }

  public switchSelected(newSelection: string) {
    this.selected = newSelection;
    this.sendMessage();
  }

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

  public selectLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.translateService.use(selectElement.value);
  }
}
