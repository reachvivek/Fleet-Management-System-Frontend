import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatteryRequestComponent } from './create-battery-request.component';

describe('CreateBatteryRequestComponent', () => {
  let component: CreateBatteryRequestComponent;
  let fixture: ComponentFixture<CreateBatteryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBatteryRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBatteryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
