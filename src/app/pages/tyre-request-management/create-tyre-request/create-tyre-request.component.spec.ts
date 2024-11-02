import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTyreRequestComponent } from './create-tyre-request.component';

describe('CreateTyreRequestComponent', () => {
  let component: CreateTyreRequestComponent;
  let fixture: ComponentFixture<CreateTyreRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTyreRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTyreRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
