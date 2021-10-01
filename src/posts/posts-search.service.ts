import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PaginationParams } from '../utils';
import Post from './entities/post.entity';
import { PostSearchBody } from './interfaces/post-search-body.interface';
import { PostsSearchResult } from './interfaces/post-search-result.interface';

@Injectable()
export default class PostsSearchService {
  constructor(private readonly elasticSearchService: ElasticsearchService) {}
  private readonly index = 'posts';

  indexPost(post: Post) {
    return this.elasticSearchService.index<PostsSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async count(query: string, fields: string[]): Promise<number> {
    const { body } = await this.elasticSearchService.count({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return body.count;
  }

  async search(text: string, pagination?: PaginationParams) {
    const { body } = await this.elasticSearchService.search<PostsSearchResult>({
      index: this.index,
      from: pagination?.offset,
      size: pagination?.limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'keywords', 'content'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: pagination?.startId || '',
                },
              },
            },
          },
        },
        sort: {
          id: {
            order: 'asc',
          },
        },
      },
    });
    const { hits } = body.hits;
    const { total } = body.hits;
    const results = hits.map((item) => item._source);
    const count = pagination?.startId
      ? await this.count(text, ['title', 'content', 'keywords'])
      : total;
    return { count, results };
  }

  update(id: string, post: Post) {
    const script = Object.entries(post).reduce(
      (result, [key, value]) => `${result} ctx._source.${key}='${value}';`,
      '',
    );
    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  delete(id: string) {
    return this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    });
  }
}
