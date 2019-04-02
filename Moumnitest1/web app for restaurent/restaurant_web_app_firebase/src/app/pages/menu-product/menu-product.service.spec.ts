import { TestBed, inject } from '@angular/core/testing';

import { MenuProductService } from './menu-product.service';

describe('MenuProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuProductService]
    });
  });

  it('should ...', inject([MenuProductService], (service: MenuProductService) => {
    expect(service).toBeTruthy();
  }));
});
