import { Component, OnInit } from '@angular/core';
import {ToastController} from  '@ionic/angular';
import {Router} from '@angular/router';

import {AngularFireAuth} from '@angular/fire/auth';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login:{
    email:string;
    password:string;
  } = {
    email:'',
    password:''
  };

  constructor(
    private router:Router,
    private toastCtrl:ToastController,
    private afAuth:AngularFireAuth
  ) { }

  ngOnInit() {
  }

  userLogin(){
    console.log("login start");

    //AutheticationStart
    this.afAuth.auth
    .signInWithEmailAndPassword(this.login.email,this.login.password)
    .then(async user => {
      const toast = await this.toastCtrl.create({
        //message:'${user.user.displayName} is login success',
        message: user.user.displayName + ' is login success',
        duration:3000
      });

      await toast.present();

      this.router.navigate(['/home']);
    })
    .catch(async error =>{
      const toast = await this.toastCtrl.create({
        message:error.toString(),
        duration:3000
      });
      await toast.present();
    })
  }

  gotoSignup(){
    this.router.navigateByUrl('/signup')
  }
}
