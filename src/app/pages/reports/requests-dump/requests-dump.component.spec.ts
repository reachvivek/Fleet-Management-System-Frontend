import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsDumpComponent } from './requests-dump.component';

describe('RequestsDumpComponent', () => {
  let component: RequestsDumpComponent;
  let fixture: ComponentFixture<RequestsDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestsDumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
