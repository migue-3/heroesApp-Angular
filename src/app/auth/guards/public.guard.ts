import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

const checkAuthStatus = (): Observable<boolean> => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
   
    return authService.checkAuthentication().pipe(
      // tap( isAuthenticated => console.log('Authenticated:', isAuthenticated) ),
      tap( (isAuthenticated) => {
        if (isAuthenticated) {
          router.navigate(['/']);
        }
      }),
      /*estamos transformando el valor, ya que con !isAuthenticated , lo que hace es invertir el valor.
        Es decir, si isAuthenticated tiene en este momento un valor true, cuando lo pasemos por !isAuthenticated
        devolverá un valor false, y viceversa.Únicamente estamos invirtiendo el valor para que el PublicGuard
        funcione justo al reves que el AuthGuard.*/
      map( isAuthenticated => !isAuthenticated )
    )
  }

  export const canActivateGuardPublic: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // console.log('CanActivate');
    // console.log({ route, state });
    return checkAuthStatus();
  };
   


  export const canMatchGuardPublic: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
    // console.log('CanMatch');
    // console.log({ route, segments });
    return checkAuthStatus();
  };
