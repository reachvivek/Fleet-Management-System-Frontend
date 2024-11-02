import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapRequestManagementComponent } from './scrap-request-management.component';

describe('ScrapRequestManagementComponent', () => {
  let component: ScrapRequestManagementComponent;
  let fixture: ComponentFixture<ScrapRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrapRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrapRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
