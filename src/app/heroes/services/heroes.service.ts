import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl = environments.baseUrl;

    constructor(private http: HttpClient) { }

    getHeroes():Observable<Hero[]> {
      return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);
    }

    getHeroesById( id: string ): Observable<Hero|undefined> {
        return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
        .pipe(
            catchError( error => of(undefined) )  //usamos el of por que tiene que ser un observable siempre lo que devuelva
        );
    }

    getSuggestions( query: string): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`)
    }

    addHero( hero: Hero ):Observable<Hero>{
        return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero); //Mandamos la data como un segundo argumento que es el hero (seria como el body)

    }

    updateHero( hero: Hero ):Observable<Hero>{
        if(!hero.id) throw Error('Hero id is required');
        
        return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id }`, hero); //Metodo patch por que solo quiero actualizar parcialmente el objeto(si solo quieres actualizar parte del registro es un patch)
    }

    deleteHeroById( id: string ):Observable<boolean>{

        return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                map( resp => true),
                catchError( err => of(false) ) //en caso de que de error le asiganamos un valor false
             );
    }



    
}