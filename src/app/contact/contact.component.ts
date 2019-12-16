import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];

  constructor(private http: HttpClient) { }

  async ngOnInit() {

    this.contacts = await this.loadItemFromFile();

  }

  async  loadItemFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    console.log('load data', data);
    return data;
  }

  addContact() {
    this.contacts.unshift(new Contact({}));
    console.log('this.contacts...', this.contacts);
  }

}
