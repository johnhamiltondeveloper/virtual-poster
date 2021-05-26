import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceSetupComponent } from './conference-setup.component';

describe('ConferenceSetupComponent', () => {
  let component: ConferenceSetupComponent;
  let fixture: ComponentFixture<ConferenceSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConferenceSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
