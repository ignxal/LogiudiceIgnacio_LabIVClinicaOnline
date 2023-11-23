import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmAdminComponent } from './abm-admin.component';

describe('AbmAdminComponent', () => {
  let component: AbmAdminComponent;
  let fixture: ComponentFixture<AbmAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbmAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
