import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComplianceRequestComponent } from './create-compliance-request.component';

describe('CreateComplianceRequestComponent', () => {
  let component: CreateComplianceRequestComponent;
  let fixture: ComponentFixture<CreateComplianceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateComplianceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateComplianceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
