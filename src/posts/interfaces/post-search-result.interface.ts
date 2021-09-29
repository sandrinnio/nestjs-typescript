import { PostSearchBody } from './post-search-body.interface';

export interface PostsSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}
