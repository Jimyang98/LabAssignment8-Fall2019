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
  contactParams = '';

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    this.loadContact();
  }
  async loadContact() {
    const saveContacts = this.getItemFromLocalStorage('contacts');
    if (saveContacts && saveContacts.length > 0) {
      this.contacts = saveContacts;
    } else {
      this.contacts = await this.loadItemFromFile();
          // not sure why there's an error here
    }
    this.sortByID(this.contacts);
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

  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemToLocalStorage(this.contacts);
  }

  saveContacts(contact: Contact) {
    contact.editing = false;
    this.saveItemToLocalStorage(this.contacts);
  }

  saveItemToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    const saveContact = localStorage.setItem('contacts', JSON.stringify(contacts));
    return saveContact;
  }

  getItemFromLocalStorage(key: string) {
    const saveContact = JSON.parse(localStorage.getItem(key));
    return saveContact;
  }

  searchContact(params: string) {
    console.log('from searchContact params:', params);

    this.contacts = this.contacts.filter((item: Contact) => {
      const fullName = item.firstName + ' ' + item.lastName;

      console.log('full name -->', fullName);
      console.log('items--->', item.firstName);
      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortByID(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, presContact: Contact) => {
      return prevContact.id > presContact.id ? 1 : -1;
    });
    console.log('the sorted contact', contacts);
    return contacts;
  }

}
