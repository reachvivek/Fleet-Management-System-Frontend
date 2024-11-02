import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOffRoadComponent } from './vehicle-off-road.component';

describe('VehicleOffRoadComponent', () => {
  let component: VehicleOffRoadComponent;
  let fixture: ComponentFixture<VehicleOffRoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleOffRoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleOffRoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
