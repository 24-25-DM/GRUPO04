import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbManagerPage } from '../../controllers/db-manager/db-manager.page';

const routes: Routes = [
  {
    path: '',
    component: DbManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DbManagerPageRoutingModule {}
