import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';

import { ActionSheetController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia:Article;
  @Input() index:number;
  @Input() enFavoritos;

  constructor(private iab: InAppBrowser,
              public  actionSheetController: ActionSheetController,
              private socialSharing: SocialSharing,
              private _dataLocal:DataLocalService,
              public toastController: ToastController
              ) { }

  ngOnInit() {
    console.log(this.enFavoritos);
  }

  abrirNoticia(){
    console.log('noticia',this.noticia.url);
    const browser = this.iab.create(this.noticia.url);
  }

async lanzarMenu(){
  
   let guardarBorrarBtn;

   if(this.enFavoritos){

    guardarBorrarBtn = {
      text: 'Eliminar de favoritos',
      icon: 'star',
      cssClass:'action-dark',
      handler: () => {
        this.mensaje('Se elimino correctamente de los favoritos');
        this._dataLocal.borrarNoticia(this.noticia);
      }
    }
   
   }else{

     guardarBorrarBtn = {
      text: 'Guardar en favoritos',
      icon: 'trash',
      cssClass:'action-dark',
      handler: () => {
        this.mensaje('Se guardo correctamente a los favoritos');
        this._dataLocal.guardarNoticia(this.noticia);
      }
    }
   }

    const actionSheet = await this.actionSheetController.create({      
      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass:'action-dark',
        handler: () => {
          console.log('Share clicked');
          this.socialSharing.share(
            this.noticia.title,
            this.noticia.source.name,
            '',
            this.noticia.url
          );
        }
      }, guardarBorrarBtn,{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass:'action-dark',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async mensaje(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  
}
