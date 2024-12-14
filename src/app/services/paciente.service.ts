import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../model/patient.interface';
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';

  private patientsSubject = new BehaviorSubject<Patient[]>([]);

  constructor(private http: HttpClient) { }

  getPatientByDni(dni: string): Observable<Patient[]> {

    console.log('Buscando paciente con DNI:', dni);
    const url =  `${this.apiUrl}/dni/${dni}`;
    console.log('URL construida:', url);
    //retornamos el resultado de la consulta
    return this.http.get<Patient[]>(url).pipe(

      //imprimimos el resultado en consola
      tap((patients) => console.log('Paciente encontrado:', patients)),

      retry(3), // Reintenta 3 veces en caso de errores transitorios
      catchError((error) => this.handleError(error))
    );
  }

  handleError(error: any): Observable<never> {
    console.error('Error en el servidor:', error);
    return new Observable<never>();
  }
}
