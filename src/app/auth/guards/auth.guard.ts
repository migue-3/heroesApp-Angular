import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


const checkAuthStatus = (): Observable<boolean> => {
    //se inyectan el AuthService y el Router
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
   
    return authService.checkAuthentication().pipe(
      // tap( isAuthenticated => console.log('Authenticated:', isAuthenticated) ),
      tap( (isAuthenticated) => {
        if (!isAuthenticated) {
          router.navigate(['/auth/login']);
        }
      })
    );
  }


/*No hay necesidad de crear una clase, simplemente definiendo una función flecha y 
  exportándola podemos utilizar sus funcionalidades de guard en el app-routing */
export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    // console.log('CanActivate');
    // console.log({ route, state });
   
    return checkAuthStatus();
  };
   

  /* CanMatch sirve para manejar ciertos roles de la app y dejar entrar al asuario segun corresponda su rol*/
  export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[] ) => {
    // console.log('CanMatch');
    // console.log({ route, segments });
   
    return checkAuthStatus();
  };
