import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agrupados',
  templateUrl: './agrupados.component.html',
  styleUrls: ['./agrupados.component.scss']
})
export class AgrupadosComponent implements OnInit {
  prefacturas: any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
