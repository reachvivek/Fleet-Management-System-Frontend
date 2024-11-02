import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRequestManagementComponent } from './compliance-request-management.component';

describe('ComplianceRequestManagementComponent', () => {
  let component: ComplianceRequestManagementComponent;
  let fixture: ComponentFixture<ComplianceRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplianceRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
