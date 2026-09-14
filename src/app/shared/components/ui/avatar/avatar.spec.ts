import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders the generated avatar image with the expected src and alt', async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    const fixture = TestBed.createComponent(Avatar);
    fixture.componentRef.setInput('firstName', 'John');
    fixture.componentRef.setInput('lastName', 'Doe');
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.src).toContain('https://ui-avatars.com/api/?name=John%20Doe');
    expect(img.alt).toBe("John's profile picture");
  });
});
