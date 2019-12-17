import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../login/login.component';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams = '';
  localStorageService: LocalStorageService<Contact>;
  currentUser: IUser;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService) {
    this.localStorageService = new LocalStorageService('contacts');
  }

  async ngOnInit() {
    const currentUser = this.localStorageService.getItemFromLocalStorage('user');
    if (currentUser == null) {
      this.router.navigate(['login']);
    }
    this.loadContact();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login:', data);
      this.currentUser = data;
    });
  }
  async loadContact() {
    const saveContacts = this.getItemFromLocalStorage('contacts');
    if (saveContacts && saveContacts.length > 0) {
      this.contacts = saveContacts;
    } else {
      this.contacts = await this.loadItemFromFile();
      // not sure why there's an error here
      // might have to command s to compile again to make it open up
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
    const id = contact.id;
    const firstName = contact.firstName;
    const lastName = contact.lastName;
    const email = contact.email;
    const phone = contact.phone;

    if (id == null || firstName == null || lastName == null || email == null || phone == null) {
      this.toastService.showToast('danger', 3000, 'Cannot be save');
    } else {
      contact.editing = false;
      this.saveItemToLocalStorage(this.contacts);
    }
  }

  saveItemToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortByID(contacts);
    return this.localStorageService.saveItemToLocalStorage(contacts);
    // const saveContact = localStorage.setItem('contacts', JSON.stringify(contacts));
    // return saveContact;
  }

  getItemFromLocalStorage(key: string) {
    // const saveContact = JSON.parse(localStorage.getItem(key));
    return this.localStorageService.getItemFromLocalStorage();
    // return saveContact;
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

  logout() {
    // clear localstorage
    this.localStorageService.clearItemFromLocalStorage('user');
    // navigate to login page
    this.router.navigate(['']);
  }

}
