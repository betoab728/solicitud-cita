import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class EspecialidadService {
  private apiUrl = 'http://localhost:3000/specialties'; // URL de tu API

  constructor(private http: HttpClient) {}

  // Método para obtener especialidades
  getEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
