import { Component, input } from '@angular/core'

@Component({
    selector: 'app-dropdown-message',
    standalone: true,
    imports: [],
    templateUrl: './dropdown-message.component.html',
    styleUrl: './dropdown-message.component.scss'
})
export class DropdownMessageComponent {
    message = input.required<string>()
}
