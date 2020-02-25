import { TestBed } from '@angular/core/testing';

import { GraphqlClientService } from './graphql-client.service';

describe('GraphqlClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphqlClientService = TestBed.get(GraphqlClientService);
    expect(service).toBeTruthy();
  });
});
