import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { BusinessCard } from '../business-card';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  businessCardsRef: any;
  userBehaviorHistoryRef: any;

  constructor(private db: AngularFireDatabase) {
    this.businessCardsRef = this.db.list('businessCards');
    this.userBehaviorHistoryRef = this.db.list('history');
  }

  addBusinessCard(businessCard: BusinessCard): Promise<any> {
    return this.businessCardsRef.push(businessCard);
  }

  getAllBusinessCards() {
    return this.businessCardsRef.valueChanges();
  }

  addHistory(userBehaviorMsg: string): Promise<any> {
    let msg = userBehaviorMsg + '  --  ' + new Date();

    return this.userBehaviorHistoryRef.push(msg);
  }

  getAllHistory() {
    return this.userBehaviorHistoryRef.valueChanges();
  }
}
