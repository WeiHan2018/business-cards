import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Gtag } from 'angular-gtag';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import { CloudVisionService } from '../service/cloud-vision.service';
import { DatabaseService } from '../service/database.service';
import { LoginService } from '../login/login.service';

import { BusinessCard } from '../business-card';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchConditionEmail: string = '';
  businessCardSearchedByEmail: BusinessCard;

  businessCards: BusinessCard[];

  useCamera: boolean = false;
  imageTaken: boolean = false;
  trigger: Subject<void> = new Subject<void>();
  webcamImage: WebcamImage = null;

  detected: boolean = false;
  detectedFirstName: string = '';
  detectedLastName: string = '';
  detectedEmail: string = '';
  detectedPhoneNumber: string = '';
  detectedExtraText: string = '';
  detectedImageUri: string = '';


  constructor(
    private cloudVisionService: CloudVisionService,
    private dbService: DatabaseService,
    private loginService: LoginService,
    private gtag: Gtag
  ) {
    this.imageTaken = true; // only for test
  }

  ngOnInit() {
    this.loginService.businessCardsRef = this.dbService.getAllBusinessCards().subscribe(
      (results) => {
        console.log('Get all business cards from Firebase successfully!');
        console.log(results);

        this.businessCards = results;
      },
      (error) => {
        console.log('Failed to get all business cards from Firebase!');
      }
    );
  }

  textDetection() {
    if (this.imageTaken !== true) {
      return;
    }

    //let imageUri = this.webcamImage.imageAsBase64;
    let imageUri = 'https://lh3.googleusercontent.com/-sQsJlPZIPTc/ThwkpQeADtI/AAAAAAAAAuI/MWUH1I_7X0A/w530-h289-n/patrick-bateman-card.png';
    
    // detect text in the image
    this.cloudVisionService.detectTextInImage(imageUri).subscribe(
      (response) => {
        console.log('Detected text in the image successfully!');
        console.log(response);
        
        // parse the original text to get a business card object
        this.getBusinessCardInfo(response);
        
        this.detected = true;

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

  getBusinessCardInfo(imageTexts: any[]) {
    let imageFullText = imageTexts[0].description;

    // parse phone number
    this.detectedPhoneNumber = this.parsePhoneNumber(imageFullText);
    // parse email
    this.detectedEmail = this.parseEmail(imageFullText);
    // parse first name
    this.detectedFirstName = 'Wei1';
    // parse last name
    this.detectedLastName = 'Han1';
    // parse extra text
    this.detectedExtraText = this.parseExtraText(imageFullText);
    // image uri base64
    //this.detectedImageUri = this.webcamImage.imageAsDataUrl;
  }

  parseExtraText(imageFullText: string): string {
    let extraText = imageFullText;

    //extraText = extraText.replace(this.detectedFirstName, '');
    //extraText = extraText.replace(this.detectedLastName, '');
    extraText = extraText.replace(this.detectedEmail, '');
    extraText = extraText.replace(this.detectedPhoneNumber, '');
    extraText = extraText.replace(/\n/g, '');

    return extraText;
  }

  addDetectedBusinessCard() {
    if (this.imageTaken !== true) {
      return;
    }

    // copy detected data to business card object
    let businessCard = new BusinessCard();
    businessCard.firstName = this.detectedFirstName;
    businessCard.lastName = this.detectedLastName;
    businessCard.email = this.detectedEmail;
    businessCard.phoneNumber = this.detectedPhoneNumber;
    businessCard.extraText = this.detectedExtraText;
    businessCard.imageUri = this.detectedImageUri;

    // add the business card to Firebase
    this.addBusinessCardToDB(businessCard);

    // add user behavior for adding new business card to history
    let userBehaviorMsg = 'User performed adding new business card to the Firebase';
    this.addHistory(userBehaviorMsg);

    this.sendEventToGoogleAnalytics();

    this.imageTaken = false;
    this.detected = false;
    this.clearDetectedInfo();
  }

  clearDetectedInfo() {
    this.detectedFirstName = '';
    this.detectedLastName = '';
    this.detectedEmail = '';
    this.detectedPhoneNumber = '';
    this.detectedExtraText = '';
  }

  sendEventToGoogleAnalytics() {
    this.gtag.event('addnew', {
      'event_category': 'engagement',
      'event_label': 'added a new business card to database successfully',
    });
  }

  toggleWebCamera() {
    this.useCamera = !this.useCamera;
  }

  takeSnapshot() {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.log('Received web camera image!', webcamImage);
    //console.log(webcamImage.imageAsDataUrl);
    //console.log(webcamImage.imageAsBase64);
    this.webcamImage = webcamImage;
    this.imageTaken = true;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  parseEmail(imageFullText: string): string {
    // regular expression for email
    let emailRegexp = new RegExp(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'g');

    let matchResult = emailRegexp.exec(imageFullText);
    
    return matchResult !== null ? matchResult[0] : '';
  }

  parsePhoneNumber(imageFullText: string): string {
    // regular expression for phone number
    //let phoneNumberRegexp = new RegExp(/\d{3}\s{0,5}\d{3}\s{0,5}\d{4}/, 'g');
    let phoneNumberRegexp = new RegExp(/((\d)\D)?(\(?(\d\d\d)\)?)?\D(\d\d\d)\D(\d\d\d\d)/, 'g');

    let matchResult = phoneNumberRegexp.exec(imageFullText);
    
    return matchResult !== null ? matchResult[0] : '';
  }

  searchByEmail() {
    if (this.searchConditionEmail.length === 0) {
      return;
    }

    this.businessCardSearchedByEmail = this.businessCards.find(businessCard => {
      return businessCard.email === this.searchConditionEmail;
    });

    // add user behavior for searching business card by email to history
    let userBehaviorMsg = 'User performed searching business card by email';
    this.addHistory(userBehaviorMsg);

    /*this.dbService.searchBusinessCardByEmail(this.email).subscribe(
      (results) => {
        console.log(results);
      }
    );*/
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
