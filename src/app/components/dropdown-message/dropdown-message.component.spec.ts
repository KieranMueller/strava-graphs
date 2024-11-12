import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMessageComponent } from './dropdown-message.component';

describe('DropdownMessageComponent', () => {
  let component: DropdownMessageComponent;
  let fixture: ComponentFixture<DropdownMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
