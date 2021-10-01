import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  IAwsModuleAsyncOptions,
  IAwsOptions,
} from './interfaces/aws-module-options.interface';
import { getAwsServiceToken } from './utils/aws.utils';

@Global()
@Module({})
export class AwsModule {
  static forRootAsync(options: IAwsModuleAsyncOptions): DynamicModule {
    return {
      module: AwsModule,
      imports: options.imports,
      providers: [this.createProviders(options)],
      exports: ['AWS_MODULE_OPTIONS_TOKEN'],
    };
  }

  static forFeature(...services: unknown[]): DynamicModule {
    const providers = services.map(this.createAwsServiceProviders);
    return {
      module: AwsModule,
      providers,
      exports: providers,
    };
  }

  private static createProviders(options: IAwsModuleAsyncOptions): Provider {
    return {
      provide: 'AWS_MODULE_OPTIONS_TOKEN',
      inject: options.inject || [],
      useFactory: options.useFactory,
    };
  }

  private static createAwsServiceProviders(service: any): Provider {
    return {
      provide: getAwsServiceToken(service.serviceIdentifier),
      useFactory: (options: IAwsOptions) =>
        new service({
          credentials: {
            accessKeyId: options.accessKeyId,
            secretAccessKey: options.secretAccessKey,
          },
          region: options.region,
        }),
      inject: ['AWS_MODULE_OPTIONS_TOKEN'],
    };
  }
}
