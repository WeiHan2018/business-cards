import { Component, OnInit } from '@angular/core';

import { DatabaseService } from '../service/database.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: string[];

  constructor(private dbService: DatabaseService) {

  }

  ngOnInit() {
    this.dbService.getAllHistory().subscribe(
      (response) => {
        console.log('Get history from Firebase successfully!');
        console.log(response);

        this.history = response;
      },
      (error) => {
        console.log('Failed to get history from Firebase!');
        console.log(error);
      }
    );
  }

}
