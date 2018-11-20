import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  showMessage: boolean = false;
  message: string = '';
  messageType: number = 0;

  constructor() { }

  setMessage(msg: string, msgType: number) {
    this.showMessage = true;
    this.message = msg;
    this.messageType = msgType;

    //setInterval(()=>{this.clearMessage();}, 500);
  }

  clearMessage() {
    this.showMessage = false;
    this.message = '';
    this.messageType = 0;
  }
}
