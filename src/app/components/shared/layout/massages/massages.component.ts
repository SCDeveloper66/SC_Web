import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-massages',
  templateUrl: './massages.component.html',
  styleUrls: ['./massages.component.scss']
})
export class MassagesComponent implements OnInit {
  msgs: Message[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
