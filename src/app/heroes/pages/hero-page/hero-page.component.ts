import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero; //opcional por que en un determinado momento cuando el componente se monta no tenemos ningun valor

  constructor( 
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute, //Servicio propio de @angular/router que nos sirve para obtener el url(los params)
    private router: Router, //Servicio para sacar a la persona de la pantalla en caso de que no exista el heroe
    ){}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        delay(1000),
        switchMap( ({id}) => this.heroesService.getHeroesById( id )), //id viene de la desestructuracion de los params
      )
      .subscribe( hero => {  //obtenemos un heroe como respuesta de la peticion http
        if (!hero) return this.router.navigate(['/heroes/list']);  //otra manera de hacerlo tambien se puede usar navigateByUrl

        this.hero = hero;
        return;
      })
  }

  goBack():void{
    this.router.navigateByUrl('heroes/list')
  }

}
