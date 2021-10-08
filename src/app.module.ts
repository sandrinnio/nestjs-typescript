import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from '@hapi/joi';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { AwsModule } from './aws/aws.module';
import { SearchModule } from './search/search.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { CommentsModule } from './comments/comments.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { EmailModule } from './email/email.module';
import { ChatModule } from './chat/chat.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // NODE_ENV: Joi.string().required(),
        PORT: Joi.number(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTICSEARCH_USERNAME: Joi.string().required(),
        ELASTICSEARCH_PASSWORD: Joi.string().required(),
        RABBITMQ_USER: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    AwsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        region: configService.get('AWS_REGION'),
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(__dirname, 'src/schema.gql'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    ScheduleModule.forRoot(),
    PostsModule,
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    CategoriesModule,
    FilesModule,
    SearchModule,
    SubscribersModule,
    CommentsModule,
    ProductsModule,
    ProductCategoriesModule,
    EmailModule,
    ChatModule,
    PubSubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
