import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { D3TreemapComponent } from './treemap.component';

describe('TreemapComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        TreemapComponent
      ],
    }).compileComponents();
  }));
});
