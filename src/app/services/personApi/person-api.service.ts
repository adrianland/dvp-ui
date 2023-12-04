import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from 'src/app/models/Person';
import { GeneralService } from 'src/app/shared/general.service';

@Injectable({
  providedIn: 'root',
})
export class PersonApiService extends GeneralService {
  
  private baseUrl: string = 'https://localhost:7200/api/dvp/Person';

  constructor(private httpClient:HttpClient)  { 
    super(httpClient)
  }

  getPersons() {
    return this.metodoGet(this.baseUrl)
  }

  addPerson(person:any) {
    return this.metodoPostApi(this.baseUrl,person)
  }

  deletePerson(id:any){
    let body = {
      id: id
    }
    let endPoint = this.baseUrl+'/delete'
    return this.metodoDeleteApi(endPoint,body);
  }

  editPerson(id : any, body:any){
    console.log(body)
    let endPoint = this.baseUrl+"/update"
    return this.metodoPutApi(`${endPoint}/?personId=${id}`,body)
  }
  
}
