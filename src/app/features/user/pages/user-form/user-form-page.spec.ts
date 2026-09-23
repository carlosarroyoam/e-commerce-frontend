import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { FORM_MODE_KEY } from '@/core/routing/form-mode';
import { UserFormPage } from './user-form-page';

describe('UserFormPage', () => {
  it('should render the heading for the route mode', async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { [FORM_MODE_KEY]: 'new' } } },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserFormPage);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('New user');
  });
});
