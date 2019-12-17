import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../localStorageService';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = { username: '', password: '' };
  localStorageService: LocalStorageService<IUser>;
  currentUser: IUser = null;

  constructor(private router: Router, private toastService: ToastService) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getItemFromLocalStorage();
    console.log('this.currentUser.....', this.currentUser);
    if (this.currentUser != null) {
      this.router.navigate(['contacts']);
    }
  }

  login(user: IUser) {
    console.log('login from user', user);
    const defaultUser: IUser = { username: 'jimy', password: 'jy123' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        // login user
        // store user in localstorage
        this.localStorageService.saveItemToLocalStorage(user);
        // navigate to contact page
        this.router.navigate(['contacts', user]);
      } else {
        // show error toast user
        this.toastService.showToast('danger', 3000, 'Login is incorrect! Please check Usename or Password');
      }
    } else {
      // show error toast user
      this.toastService.showToast('danger', 3000, 'Login is incorrect! Enter the correct Username or Password');
    }
  }

}
