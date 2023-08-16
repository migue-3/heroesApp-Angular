import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>(''),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    /* Validamos por la url, si tiene la palabra edit, si no la tiene no ocupo hacer nada dejamos
       el form con su valor por defecto y vamos a crear un nuevo registro
    */
    if (!this.router.url.includes('edit')) return;

    /*Tenemos la palabra edit en el url significa que hay que actualizar un heroe
       y verificarlo osea cargar su data, para saber cuales son los parametros que
        vienen en la url usamos ActivatedRoute
    */
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroesById(id)) //Buscamos el heroe por su id, el id viene de la desestructuracion de params
      )
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');

        /*
        si existe el heroe, establecemos sus valores al formulario
        el reset establece automaticamente cada uno de los campos cuyos
        nombres coincidan con los del formulario, asi que le enviamos el hero
        */
        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit(): void {
    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value
    // })

    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO: mostrar snackbar
        this.showSnackbar(`${hero.superhero} updated!`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      //TODO: mostrar snackbar, y navegar a /heroes/edit/hero.id
      this.showSnackbar(`${hero.superhero} created!`);
      this.router.navigate(['/heroes/edit', hero.id]);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.heroesService.deleteHeroById(this.currentHero.id)
        .subscribe((result) => {
          if (result) this.router.navigate(['/heroes']);
        });
    });
  }

    /*
    Metodo para mandar a llamar el snackbar donde recibe el message
  */
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
