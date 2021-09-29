import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
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

  async search(text: string) {
    const { body } = await this.elasticSearchService.search<PostsSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const { hits } = body.hits;
    return hits.map((item) => item._source);
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
