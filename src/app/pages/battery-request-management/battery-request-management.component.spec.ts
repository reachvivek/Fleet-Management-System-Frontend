import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryRequestManagementComponent } from './battery-request-management.component';

describe('BatteryRequestManagementComponent', () => {
  let component: BatteryRequestManagementComponent;
  let fixture: ComponentFixture<BatteryRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatteryRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatteryRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
