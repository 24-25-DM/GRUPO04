import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DbManagerPageRoutingModule } from './db-manager-routing.module';
import { DbManagerPage } from '../../controllers/db-manager/db-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DbManagerPageRoutingModule
  ],
  declarations: [DbManagerPage]
})
export class DbManagerPageModule {}