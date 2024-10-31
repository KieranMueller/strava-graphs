import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSettingsModalComponent } from './advanced-settings-modal.component';

describe('AdvancedSettingsModalComponent', () => {
  let component: AdvancedSettingsModalComponent;
  let fixture: ComponentFixture<AdvancedSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSettingsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
