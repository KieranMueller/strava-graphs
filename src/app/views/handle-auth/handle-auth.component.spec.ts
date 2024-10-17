import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleAuthComponent } from './handle-auth.component';

describe('HandleAuthComponent', () => {
  let component: HandleAuthComponent;
  let fixture: ComponentFixture<HandleAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandleAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
