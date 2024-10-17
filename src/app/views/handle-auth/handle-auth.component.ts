import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AuthParams } from '../../shared/types'

@Component({
  selector: 'app-handle-auth',
  standalone: true,
  imports: [],
  templateUrl: './handle-auth.component.html',
  styleUrl: './handle-auth.component.scss'
})
export class HandleAuthComponent implements OnInit {
    params: AuthParams = {
        code: '',
        scope: '',
        state: ''
    }

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        let params = this.route.snapshot.queryParams;
        this.params = {...this.params, ...params}
    }

}
