import { WikiDetails } from './wiki-details';

export interface WikiResponse {
  batchcomplete: boolean;
  query: {
    search: WikiDetails[];
  }
}
