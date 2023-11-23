import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistAdminComponent } from './userlist-admin.component';

describe('AdminUserlistComponent', () => {
  let component: UserlistAdminComponent;
  let fixture: ComponentFixture<UserlistAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserlistAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserlistAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
