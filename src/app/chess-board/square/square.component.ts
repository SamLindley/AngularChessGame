import {Component, Input, OnInit} from '@angular/core';
import {Square} from '../../models/square.model';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {
  @Input() square: Square;

  constructor() { }

  ngOnInit() {
  }

  onSquareClick() {
    console.log(this.square);
  }
}
