import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'conference';
  // tslint:disable-next-line:typedef
  getState(outlet){
    return outlet.isActivated ? outlet.activatedRoute.snapshot.url[0].path : 'none';
  }
}
