import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

    private baseUrl = environments.baseUrl;
    private user?: User;

    constructor(private http: HttpClient) { }

    get currentUser():User|undefined {
        if ( !this.user) return undefined;
        return structuredClone( this.user );  //crea un clon del objeto user
    }

    login( email: string, password: string):Observable<User>{

       return this.http.get<User>( `${ this.baseUrl }/users/1`)
            .pipe(
                tap( user => this.user = user),
                tap( user => localStorage.setItem('token', 'Ajsdjsdj.sdjAjhDShs.2sjhdjd' )),
            );
    }

    checkAuthentication(): Observable<boolean> {
        if ( !localStorage.getItem('token') ) return of(false);

        const token = localStorage.getItem('token');

        return this.http.get<User>(`${this.baseUrl}/users/1`)
            .pipe(
                tap( user => this.user = user ), //establece la propiedad pero no le cambia el valor
                map( user => !!user ), //Usamos la doble negacion !! para asegurarnos de que retorne un valor booleano y map para transformar la data

                catchError( err => of(false) )
            )
    }

    logout() {
        this.user = undefined;
        localStorage.clear();
    }
    
}