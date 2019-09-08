import { Component, OnInit } from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';

import {AngularFirestore,AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';

import {Post} from '../models/post';
import { async } from '@angular/core/testing';

import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  message:string ="";
  post:Post;
  posts:Post[];

  postsCollection:AngularFirestoreCollection<Post>;

  constructor(
    private alertCtrl:AlertController,
    private toastCtrl:ToastController,
    private afStore:AngularFirestore,
    private afAuth:AngularFireAuth,
    private router:Router
  )
  {

  }

  ngOnInit(){
    this.getPosts();
  }

  addPost(){
    console.log('test');
    console.log(this.afAuth.auth.currentUser.displayName);
    console.log(this.message);
    console.log((firebase.firestore.FieldValue.serverTimestamp()).toString());
    //make postdate
    this.post = {
      id:'',
      userName:this.afAuth.auth.currentUser.displayName,
      message:this.message,
      created:firebase.firestore.FieldValue.serverTimestamp()
    };
    
    console.log("test2");

    //add data in firebase
    this.afStore
      .collection('posts')
      .add(this.post)
      .then(docRef => {
        console.log("success");
        this.postsCollection.doc(docRef.id).update({
          id:docRef.id
        });
        this.message = '';
      })
      .catch(async error => {
        console.log("error");
        const toast = await this.toastCtrl.create({
          message:error.toString(),
          duration:3000
        });
        await toast.present();
      });
  }

  //read data from firebase
  getPosts(){
    console.log("get data");

    this.postsCollection = this.afStore.collection(
      'posts',ref => ref.orderBy('created','desc')
    );

    this.postsCollection.valueChanges().subscribe(data => {
      this.posts = data;
    });
  }

  async presentPrompt(post:Post){
    const alert = await this.alertCtrl.create({
      header:'message update',
      inputs:[
        {
          name:'message',
          type:'text',
          placeholder:'MESSAGE'
        }
      ],
      buttons:[
        {
          text:'cancel',
          role:'cancel',
          handler:() => {
            console.log('select cancel');
          }
        },
        {
          text:'update',
          handler:data => {
            this.updatePost(post,data.message);
          }
        }
      ]
    });
    await alert.present();
  }

  //update message
  updatePost(post:Post,message:string){
    this.postsCollection
      .doc(post.id)
      .update({
        message:message
      })
      .then(async() => {
        const toast = await this.toastCtrl.create({
          message:'update data',
          duration:3000
        });
        await toast.present();
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message:error.toString(),
          duration:3000
        });
        await toast.present();
      })
  }

  //delete message
  deletePost(post:Post){
    //use id to delete data
    this.postsCollection
      .doc(post.id)
      .delete()
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message:'delete data',
          duration:3000
        });
        await toast.present();
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message:error.toString(),
          duration:3000
        });
        await toast.present();
      });
  }

  gotoSignup(){
    this.router.navigateByUrl('/login')
  }
}
