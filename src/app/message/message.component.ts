import { Component, OnInit } from '@angular/core';

import { MessageService } from './message.service';
//import { MessageType } from './message.type';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(private msgService: MessageService) { }

  ngOnInit() {
  }

}
