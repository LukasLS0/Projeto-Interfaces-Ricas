import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpbloqIncluir } from './ipbloq-incluir';

describe('IpbloqIncluir', () => {
  let component: IpbloqIncluir;
  let fixture: ComponentFixture<IpbloqIncluir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqIncluir],
    }).compileComponents();

    fixture = TestBed.createComponent(IpbloqIncluir);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
