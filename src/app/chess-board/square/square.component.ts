import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Square} from '../../models/square.model';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() square: Square;
  @Output() squareClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSquareClick() {
    this.squareClicked.emit();
  }
}
