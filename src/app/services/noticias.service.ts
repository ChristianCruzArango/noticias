import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaTopHeadlines } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const apikey = environment.apiKey;
const apiUrl = environment.apiUrl;

const headers = new HttpHeaders({
  'X-Api-key':apikey
});

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  headlinesPages = 0;

  categoriaActual = '';
  categoriaPage   = 0;


  constructor(private http:HttpClient) { }

  /*la T significa que es de tipo de datos generico para poder recibir cualquier tipo de dato que se envie fuera
  de la funcion donde se esta llamando */
  private ejecutarQuery<T>(query:string){    
    query= apiUrl + query;
    return this.http.get<T>(query,{headers})
  }

  getTopHeadlines(){    
    this.headlinesPages ++;
     return this.ejecutarQuery<RespuestaTopHeadlines>(`/top-headlines?country=us&page=${this.headlinesPages}`);  
  }

  getTopHeadlinesCategoria(categoria:string){

    if(this.categoriaActual === categoria){
      this.categoriaPage ++;
    }else{
      this.categoriaPage = 1;
      this.categoriaActual = categoria;
    }

    return this.ejecutarQuery<RespuestaTopHeadlines>(`/top-headlines?country=us&category=${categoria}&page=${this.categoriaPage}`);
  }


}
