import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Asegúrate de que está importado de aquí
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon'; // URL de la API

  constructor(private http: HttpClient) {}

  getPokemonByType(type: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/type/${type}`);
  }

  getPokemon(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${name}`);
  }
}
