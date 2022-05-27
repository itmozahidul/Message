import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginUser } from '../Model/loginUser';
import { registerUser } from '../Model/registerUser';
import { GeneralService } from '../service/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
 loginForm = new FormGroup({
   adress:new FormControl('', [Validators.required, Validators.maxLength(25)]),
   imp:new FormControl('', [Validators.required, Validators.maxLength(15)]),
    });
    errommsg:string="";
    hasError:boolean= false;
  constructor(private general:GeneralService, private router:Router,) { }

  ngOnInit() {}

  onFormSubmit(){
    this.general.showBusy();
      if(this.loginForm.get("adress").value==""){
        this.hasError=true;
        if(this.loginForm.get("imp").value==""){
          this.errommsg="Input can not be empty!" ;
        }else{
          this.errommsg="Username is empty!" ;
        }
        this.general.endBusy();
      }else if(this.loginForm.get("imp").value==""){
        this.hasError=true;
        this.errommsg="Password is empty!" ;
        
        this.general.endBusy();
      }else{
        this.hasError=false;
        this.errommsg="";
        let data:loginUser = {
          "adress":this.loginForm.get("adress").value,
          "imp":this.loginForm.get("imp").value,
        }
        console.log(data);
        this.general.login(data).subscribe(
          (suc)=>{
            this.general.endBusy();
            if(suc.jwt!=""){
              console.log(suc);
            if(this.general.prepareSession(suc.jwt)){
              this.router.navigate(["chat"]);
            }
            }else{
              console.log("ERROR");
            this.errommsg="Incorrect Password!" ;
            this.hasError=true;
            }
            
          },
          (err)=>{
            this.general.endBusy();
            console.log(err);
            this.errommsg="Network Error !" ;
            this.hasError=true;
            
          }
        );
      }
    
  }

}
