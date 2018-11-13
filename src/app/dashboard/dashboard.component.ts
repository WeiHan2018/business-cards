import { Component, OnInit } from '@angular/core';

import { CloudVisionService } from '../service/cloud-vision.service';
import { DatabaseService } from '../service/database.service';

import { BusinessCard } from '../business-card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  businessCards: BusinessCard[];

  constructor(
    private cloudVisionService: CloudVisionService,
    private dbService: DatabaseService,
  ) { }

  ngOnInit() {
    this.dbService.getAllBusinessCards().subscribe(
      (response) => {
        console.log('Get all business cards from Firebase successfully!');
        console.log(response);

        this.businessCards = response;
      },
      (error) => {
        console.log('Failed to get all business cards from Firebase!');
      }
    );
  }

  textDetection() {
    let tmpUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png';

    // detect text in the image
    this.cloudVisionService.detectTextInImage(tmpUri).subscribe(
      (response) => {
        console.log('Detected text in the image successfully!');
        console.log(response);
        
        // parse the original text to get a business card object
        let businessCard = this.getBusinessCardInfo(response);

        // add the business card to Firebase
        this.addBusinessCardToDB(businessCard);

        // add user behavior for text detection to history
        let userBehaviorMsg = 'User performed text detection on business card';
        this.addHistory(userBehaviorMsg);
      },
      (error) => {
        console.log('Failed to detect text in the image!');
        console.log(error);
      }
    );

  }

  getBusinessCardInfo(originalText: string): BusinessCard {
    // TODO parse first name, last name, email and phone number from original text

    // dummy...begin
    let businessCard = new BusinessCard();
    businessCard.firstName = 'Wei100';
    businessCard.lastName = 'Han100';
    businessCard.email = 'hanwei100@gmail.com';
    businessCard.phoneNumber = '100888888888';
    businessCard.extraText = 'extra text 100';
    businessCard.imageUri = 'Base64 100aaaaaaaaaaaaaaaaaa';
    //businessCard = '';

    return businessCard;
    // dummy...end
  }

  addHistory(userBehaviorMsg: string) {
    this.dbService.addHistory(userBehaviorMsg).then(
      (_) => {
        console.log(`Added user behavior 'text detection' to history in Firebase successfully!`);       
      },
      (error) => {
        console.log(`Failed to add user behavior 'text detection' to history in Firebase!`);
      }
    );
  }

  addBusinessCardToDB(businessCard: BusinessCard) {
    this.dbService.addBusinessCard(businessCard).then(
      (_) => {
        console.log('Added the business card to Firebase successfully!');      
      },
      (error) => {
        console.log('Failed to add the business card to Firebase!');
      }
    );
  }
}
