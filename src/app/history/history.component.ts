import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../service/database.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: string[];
  historyRef: any;

  constructor(private dbService: DatabaseService, private loginService: LoginService) {

  }

  ngOnInit() {
    this.historyRef = this.dbService.getAllHistory().subscribe(
      (response) => {
        console.log('Get history from Firebase successfully!');
        console.log(response);

        this.history = response;
        
        this.historyRef.unsubscribe();
      },
      (error) => {
        console.log('Failed to get history from Firebase!');
        console.log(error);
      }
    );
  }

}
