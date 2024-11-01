import { Component, HostListener, OnInit, output } from '@angular/core'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { SettingsService } from '../../shared/settings.service'
import { AdvancedSettings } from '../../shared/types'
import { LOCAL_STORAGE_ADV_SETTINGS } from '../../shared/env'

@Component({
    selector: 'app-advanced-settings-modal',
    standalone: true,
    imports: [CdkDrag],
    templateUrl: './advanced-settings-modal.component.html',
    styleUrl: './advanced-settings-modal.component.scss'
})
export class AdvancedSettingsModalComponent implements OnInit {
    closeEmitter = output()
    advancedSettings = {
        pointRadius: 5,
        trendlineWidth: 2,
        aspectRatio: 1.5
    }

    constructor(private settingsService: SettingsService) { }

    ngOnInit() {
        this.settingsService.pointRadius.subscribe({
            next: value => this.advancedSettings.pointRadius = value
        })
        this.settingsService.trendlineWidth.subscribe({
            next: value => this.advancedSettings.trendlineWidth = value
        })
        this.settingsService.aspectRatio.subscribe({
            next: value => this.advancedSettings.aspectRatio = value
        })
    }

    @HostListener('window:click', ['$event'])
    handleClick(event: any) {
        const clickedOutsideModal = event.srcElement.classList[0] === 'container'
        if (clickedOutsideModal) this.close()
    }

    close() {
        this.closeEmitter.emit()
    }

    updateSettings(event: any, setting: AdvancedSettings) {
        const val: number = parseInt(event.target.value)
        switch (setting) {
            case 'pointRadius': {
                this.settingsService.pointRadius.next(val)
                break
            }
            case 'trendlineWidth': {
                this.settingsService.trendlineWidth.next(val)
                break
            }
            case 'aspectRatio': {
                this.settingsService.aspectRatio.next(val)
                break
            }
        }
        localStorage.setItem(LOCAL_STORAGE_ADV_SETTINGS, JSON.stringify(this.advancedSettings))
    }

    reset() {
        this.settingsService.pointRadius.next(5)
        this.settingsService.trendlineWidth.next(2)
        this.settingsService.aspectRatio.next(1.5)
        localStorage.setItem(LOCAL_STORAGE_ADV_SETTINGS, JSON.stringify(this.advancedSettings))
    }
}
