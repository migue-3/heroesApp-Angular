import { NgModule } from '@angular/core';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';



@NgModule({
  declarations: [
    Error404PageComponent
  ],
  exports: [
    Error404PageComponent  //exportamos el componente por que quiero que sea una ruta por defecto que voy a tener en mi app-rputing.module
  ]
})
export class SharedModule { }
