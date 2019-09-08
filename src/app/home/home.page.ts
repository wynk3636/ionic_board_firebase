import { Component } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alertCtrl:AlertController) {}

  message:string

  post:{
    userName:string,
    message:string,
    createdDate:any
  }={
    userName:'Taro Yamada',
    message:'testmessage',
    createdDate:'10 minutes ago'
  }

  posts:{
    userName:string,
    message:string,
    createdDate:any
  }[] = [
    {
      userName:'Taro Yamada',
      message:'testmessage',
      createdDate:'10 minutes ago'
    },
    {
      userName:'Ziro Suzuki',
      message:'testmessage2',
      createdDate:'5 minutes ago'
    }
  ]

  addPost(){
    this.post = {
      userName:'Ziro Suzuki',
      message:'testmessage2',
      createdDate:'5 minutes ago'
    };

    this.posts.push(this.post);
    this.message="";
  }

  async presentPrompt(index:number){
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
            text:'chancel',
            role:'chancel',
            handler:()=>{
              console.log('select chancel')
            }
          },
          {
            text:'update',
            handler:data =>{
              console.log(data);
              this.posts[index].message =data.message;
            }
          }
        ]
    });
    await alert.present();
  }

  deletePost(index:number){
    this.posts.splice(index,1);
  }

}
