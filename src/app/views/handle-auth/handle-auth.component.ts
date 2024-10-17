import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-handle-auth',
  standalone: true,
  imports: [],
  templateUrl: './handle-auth.component.html',
  styleUrl: './handle-auth.component.scss'
})
export class HandleAuthComponent implements OnInit {

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        console.log(this.route)
    }

}
