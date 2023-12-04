import { AuthService } from '../../services/authApi/auth.service';
import { PersonApiService } from '../../services/personApi/person-api.service';
import { Component, OnInit } from '@angular/core';
import { UserStoreService } from 'src/app/services/user/user-store.service';
import { Person } from 'src/app/models/Person';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validationform';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  public persons = Array<Person>();
  public fullName: string = "";
  public isRegister = true;

  constructor(private personApiService: PersonApiService, private auth: AuthService, private userStore: UserStoreService, private formBuilder: FormBuilder,    private toast: NgToastService,) { }

  checkoutForm = this.formBuilder.group({
    id: 0,
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    documentNumber: ['', Validators.required],
    documentType: ['', Validators.required],
    email: ['', Validators.required],
  });

  ngOnInit() {
    this.initLoad();
  }

  initLoad() {
    const allPersons = firstValueFrom(this.personApiService.getPersons())
    const getUserName = firstValueFrom(this.userStore.getUserNameFromStore())
    const fullNameFromToken = this.auth.getUserNameFromToken();

    Promise.all([allPersons, getUserName]).then(res => {
      if (res[0].status) {
        this.persons = res[0].data['$values'];
      }
      this.fullName = res[1] || fullNameFromToken
    })
  }

  logout() {
    this.auth.signOut();
  }

  onSubmit(): void {

    const person = this.checkoutForm.value;

    if (this.checkoutForm.valid) {

      const newPerson = firstValueFrom(this.personApiService.addPerson(person));

      Promise.all([newPerson]).then(res => {

        if (res[0]) {
          this.toast.success({ detail: "SUCCESS", summary: "Successful registration", duration: 5000 });

          setTimeout(() => {
            this.initLoad()
          }, 1000);
          this.checkoutForm.reset();
        }

      }).catch(err => {
        this.toast.error({ detail: "ERROR", summary: "Something when wrong!", duration: 5000 });
        console.log(err);
      })

    } else {
      ValidateForm.validateAllFormFields(this.checkoutForm);
    }

  }

  public cancelEdit() {
    this.checkoutForm.reset();
    this.isRegister = true
  }

  public setEditPerson(id: any) {
     this.isRegister = false
     const person: any = this.persons.find(e => e.Id == id);
     console.log(person)
     this.checkoutForm.patchValue({ id: person.Id, name: person.Name, lastName: person.LastName, documentNumber: person.DocumentNumber, documentType: person.DocumentType, email: person.Email})
  }

  public editPerson() {
    const person = this.checkoutForm.value;

    if (this.checkoutForm.valid) {

      const editPerson = firstValueFrom(this.personApiService.editPerson(person.id, person));

      Promise.all([editPerson]).then(res => {

        if (res[0]) {
          setTimeout(() => {
          this.toast.success({ detail: "SUCCESS", summary: "successful edition", duration: 5000 });
            
            this.initLoad()
          }, 1000);
          this.checkoutForm.reset();
        }

      }).catch(err => {
        this.toast.error({ detail: "ERROR", summary: "Something when wrong!", duration: 5000 });
        console.log(err);
      })

    } else {
      ValidateForm.validateAllFormFields(this.checkoutForm);
    }

  }

  public deletePerson(id: any) {
    this.isRegister = true
    this.checkoutForm.reset();

    let text = "Are you sure you want to delete this person?";
    if (confirm(text) == true) {
      const deletePerson = firstValueFrom(this.personApiService.deletePerson(id));
      Promise.all([deletePerson]).then(res => {

        if (res[0]) {
          this.toast.success({ detail: "SUCCESS", summary: "successful removal", duration: 5000 });

          setTimeout(() => {
            this.initLoad()
          }, 1500);

        }

      }).catch(err => {
        this.toast.error({ detail: "ERROR", summary: "Something when wrong!", duration: 5000 });
        console.log(err);
      })
    }

  }

}
