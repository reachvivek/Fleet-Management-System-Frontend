import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemPartComponent } from './system-part.component';

describe('SystemPartComponent', () => {
  let component: SystemPartComponent;
  let fixture: ComponentFixture<SystemPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SystemPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
