import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { DatabaseAlbumRepository } from '@infrastructure/repositories/album.repository';
import { DatabaseAnniversaryRepository } from '@infrastructure/repositories/anniversary.repository';
import { DatabaseCoupleChannelRepository } from '@infrastructure/repositories/couple-channel.repository';
import { DatabaseCoupleInfoRepository } from '@infrastructure/repositories/couple-info.repository';
import { DatabaseDeviceRepository } from '@infrastructure/repositories/device.repository';
import { DatabaseFeedLikerRepository } from '@infrastructure/repositories/feed-liker.repository';
import { DatabaseFeedRepository } from '@infrastructure/repositories/feed.repository';
import { DatabaseMessageRepository } from '@infrastructure/repositories/message.repository';
import { DatabasePhotoRepository } from '@infrastructure/repositories/photo.repository';
import { DatabaseProfileImageRepository } from '@infrastructure/repositories/profile-image.repository';
import { DatabaseProfileRepository } from '@infrastructure/repositories/profile.repository';
import { RepositoriesModule } from '@infrastructure/repositories/repositories.module';
import { DatabaseUserRepository } from '@infrastructure/repositories/user.repository';
import { AppleAuthService } from '@infrastructure/services/apple/apple-auth.service';
import { AppleModule } from '@infrastructure/services/apple/apple.module';
import { AwsModule } from '@infrastructure/services/aws/aws.module';
import { AwsService } from '@infrastructure/services/aws/aws.service';
import { BcryptServiceModule } from '@infrastructure/services/bcrypt/bcrypt.module';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { ExceptionsService } from '@infrastructure/services/exceptions/exceptions.service';
import { GoogleAuthService } from '@infrastructure/services/google/google-auth.service';
import { GoogleModule } from '@infrastructure/services/google/google.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { KakaoAuthService } from '@infrastructure/services/kakao/kakao-auth.service';
import { KakaoModule } from '@infrastructure/services/kakao/kakao.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { RedisCacheModule } from '@infrastructure/services/redis-cache/redis-cache.module';
import { RedisCacheService } from '@infrastructure/services/redis-cache/redis-cache.service';
import { DynamicModule, Module } from '@nestjs/common';
import { AppleOAuthUseCases } from 'src/usecases/auth/apple-oauth.usecases';
import { GoogleOAuthUseCases } from 'src/usecases/auth/google-oauth.usecases';
import { KakaoOAuthUseCases } from 'src/usecases/auth/kakao-oauth.usecases';
import { LoginUseCases } from 'src/usecases/auth/login.usecases';
import { LogoutUseCases } from 'src/usecases/auth/logout.usecases';
import { CreateMessageUseCases } from 'src/usecases/chat/create-message.usecases';
import { GetMessageUseCases } from 'src/usecases/chat/get-message.usecases';
import { ReadMessageUseCases } from 'src/usecases/chat/read-message.usecases';
import { AddAnniversaryUseCases } from 'src/usecases/couple/add-anniversary.usecases';
import { CreateCoupleChannelUseCases } from 'src/usecases/couple/create-couple-channel.usecases';
import { GenerateCoupleCodeUseCases } from 'src/usecases/couple/generate-couple-code.usecases';
import { GetCoupleUseCases } from 'src/usecases/couple/get-couple.usecases';
import { UpdateCoupleUseCases } from 'src/usecases/couple/update-couple.usecases';
import { CreateFeedUseCases } from 'src/usecases/feed/create-feed.usecases';
import { DeleteFeedUseCases } from 'src/usecases/feed/delete-feed.usecases';
import { GetFeedUseCases } from 'src/usecases/feed/get-feed.usecases';
import { LikeFeedUseCases } from 'src/usecases/feed/like-feed.usecases';
import { PresignedFeedImagesUseCases } from 'src/usecases/feed/presigned-feed-images.usecases';
import { UpdateFeedUseCases } from 'src/usecases/feed/update-feed.usecases';
import { CreateUserUseCases } from 'src/usecases/user/create-user.usecases';
import { DeleteUserUseCases } from 'src/usecases/user/delete-user.usercases';
import { GetUserUseCases } from 'src/usecases/user/get-user.usecases';
import { PresignedProfileImageUseCases } from 'src/usecases/user/presigned-profile-image.usecases';
import { UpdateUserUseCases } from 'src/usecases/user/update-user.usecases';
import { UseCaseProxy } from './usercases-proxy';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    BcryptServiceModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    RedisCacheModule,
    GoogleModule,
    KakaoModule,
    AppleModule,
    AwsModule,
  ],
})
export class UseCasesProxyModule {
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static GOOGLE_OAUTH_USECASES_PROXY = 'GoogleOAuthUseCasesProxy';
  static APPLE_OAUTH_USECASES_PROXY = 'AppleOAuthUseCasesProxy';
  static KAKAO_OAUTH_USECASES_PROXY = 'KakaoOAuthUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static CREATE_USER_USECASES_PROXY = 'CreateUserUseCasesProxy';
  static UPDATE_USER_USECASES_PROXY = 'UpdateUserUseCasesProxy';
  static PRESIGNED_PROFILE_IMAGE_USECASES_PROXY = 'PresignedUserUseCasesProxy';
  static GET_USER_USECASES_PROXY = 'GetUserUseCasesProxy';
  static DELETE_USER_USECASES_PROXY = 'DeleteUserUseCasesProxy';

  static GENERATE_COUPLE_CODE_USECASES_PROXY =
    'GenerateCoupleCodeUseCasesProxy';
  static CREATE_COUPLE_CHANNEL_USECASES_PROXY =
    'CreateCoupleChannelUseCasesProxy';
  static GET_COUPLE_USECASES_PROXY = 'GetCoupleUseCasesProxy';
  static ADD_ANNIVERSARY_USECASES_PROXY = 'AddAnniversaryUseCasesProxy';
  static UPDATE_COUPLE_USECASES_PROXY = 'UpdateCoupleUseCasesProxy';
  static PRESIGNED_FEED_IMAGES_USECASES_PROXY =
    'PresignedFeedImagesUseCasesProxy';
  static CREATE_FEED_USECASES_PROXY = 'CreateFeedUseCasesProxy';

  static LIKE_FEED_USECASES_PROXY = 'LikeFeedUseCasesProxy';
  static GET_FEED_USECASES_PROXY = 'GetFeedUseCasesProxy';
  static UPDATE_FEED_USECASES_PROXY = 'UpdateFeedUseCasesProxy';
  static DELETE_FEED_USECASES_PROXY = 'DeleteFeedUseCasesProxy';

  static CREATE_MESSAGE_USECASES_PROXY = 'CreateMessageUseCasesProxy';
  static GET_MESSAGE_USECASES_PROXY = 'GetMessageUseCasesProxy';

  static READ_MESSAGE_USECASES_PROXY = 'ReadMessageUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseUserRepository,
            DatabaseDeviceRepository,
            RedisCacheService,
            BcryptService,
          ],
          provide: UseCasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            deviceRepo: DatabaseDeviceRepository,
            redisCacheService: RedisCacheService,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                jwtTokenService,
                config,
                userRepo,
                deviceRepo,
                redisCacheService,
                bcryptService,
              ),
            ),
        },
        {
          inject: [GoogleAuthService],
          provide: UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY,
          useFactory: (googleAuthService: GoogleAuthService) =>
            new UseCaseProxy(new GoogleOAuthUseCases(googleAuthService)),
        },
        {
          inject: [AppleAuthService],
          provide: UseCasesProxyModule.APPLE_OAUTH_USECASES_PROXY,
          useFactory: (appleAuthService: AppleAuthService) =>
            new UseCaseProxy(new AppleOAuthUseCases(appleAuthService)),
        },
        {
          inject: [KakaoAuthService],
          provide: UseCasesProxyModule.KAKAO_OAUTH_USECASES_PROXY,
          useFactory: (kakaoAuthService: KakaoAuthService) =>
            new UseCaseProxy(new KakaoOAuthUseCases(kakaoAuthService)),
        },
        {
          inject: [RedisCacheService],
          provide: UseCasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: (redisCacheService: RedisCacheService) =>
            new UseCaseProxy(new LogoutUseCases(redisCacheService)),
        },
        {
          inject: [
            DatabaseUserRepository,
            DatabaseDeviceRepository,
            DatabaseProfileRepository,
            DatabaseProfileImageRepository,
          ],
          provide: UseCasesProxyModule.CREATE_USER_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            deviceRepo: DatabaseDeviceRepository,
            profileRepo: DatabaseProfileRepository,
            profileImageRepo: DatabaseProfileImageRepository,
          ) =>
            new UseCaseProxy(
              new CreateUserUseCases(
                userRepo,
                deviceRepo,
                profileRepo,
                profileImageRepo,
              ),
            ),
        },
        {
          inject: [JwtTokenService, EnvironmentConfigService],
          provide: UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY,
          useFactory: (
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
          ) =>
            new UseCaseProxy(
              new GenerateCoupleCodeUseCases(jwtTokenService, config),
            ),
        },
        {
          inject: [
            DatabaseCoupleChannelRepository,
            DatabaseCoupleInfoRepository,
            DatabaseAlbumRepository,
            DatabaseUserRepository,
            JwtTokenService,
            EnvironmentConfigService,
            ExceptionsService,
          ],
          provide: UseCasesProxyModule.CREATE_COUPLE_CHANNEL_USECASES_PROXY,
          useFactory: (
            coupleChannelRepo: DatabaseCoupleChannelRepository,
            coupleInfoRepo: DatabaseCoupleInfoRepository,
            albumRepo: DatabaseAlbumRepository,
            userRepo: DatabaseUserRepository,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new CreateCoupleChannelUseCases(
                coupleChannelRepo,
                coupleInfoRepo,
                albumRepo,
                userRepo,
                jwtTokenService,
                config,
                exceptionService,
              ),
            ),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UseCasesProxyModule.GET_USER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new GetUserUseCases(userRepo)),
        },
        {
          inject: [
            DatabaseUserRepository,
            DatabaseProfileRepository,
            DatabaseProfileImageRepository,
          ],
          provide: UseCasesProxyModule.UPDATE_USER_USECASES_PROXY,
          useFactory: (
            userRepo: DatabaseUserRepository,
            profileRepo: DatabaseProfileRepository,
            profileImageRepo: DatabaseProfileImageRepository,
          ) =>
            new UseCaseProxy(
              new UpdateUserUseCases(userRepo, profileRepo, profileImageRepo),
            ),
        },
        {
          inject: [AwsService],
          provide: UseCasesProxyModule.PRESIGNED_PROFILE_IMAGE_USECASES_PROXY,
          useFactory: (awsService: IAwsS3Service) =>
            new UseCaseProxy(new PresignedProfileImageUseCases(awsService)),
        },
        {
          inject: [DatabaseCoupleChannelRepository],
          provide: UseCasesProxyModule.GET_COUPLE_USECASES_PROXY,
          useFactory: (coupleChannelRepo: DatabaseCoupleChannelRepository) =>
            new UseCaseProxy(new GetCoupleUseCases(coupleChannelRepo)),
        },
        {
          inject: [
            DatabaseAnniversaryRepository,
            DatabaseCoupleChannelRepository,
            ExceptionsService,
          ],
          provide: UseCasesProxyModule.ADD_ANNIVERSARY_USECASES_PROXY,
          useFactory: (
            anniversaryRepo: DatabaseAnniversaryRepository,
            coupleChannelRepo: DatabaseCoupleChannelRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new AddAnniversaryUseCases(
                anniversaryRepo,
                coupleChannelRepo,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            DatabaseCoupleInfoRepository,
            DatabaseCoupleChannelRepository,
          ],
          provide: UseCasesProxyModule.UPDATE_COUPLE_USECASES_PROXY,
          useFactory: (
            coupleInfoRepo: DatabaseCoupleInfoRepository,
            coupleChannelRepo: DatabaseCoupleChannelRepository,
          ) =>
            new UseCaseProxy(
              new UpdateCoupleUseCases(coupleInfoRepo, coupleChannelRepo),
            ),
        },
        {
          inject: [AwsService],
          provide: UseCasesProxyModule.PRESIGNED_FEED_IMAGES_USECASES_PROXY,
          useFactory: (awsService: AwsService) =>
            new UseCaseProxy(new PresignedFeedImagesUseCases(awsService)),
        },
        {
          inject: [
            DatabaseFeedRepository,
            DatabaseCoupleChannelRepository,
            DatabasePhotoRepository,
          ],
          provide: UseCasesProxyModule.CREATE_FEED_USECASES_PROXY,
          useFactory: (
            feedRepo: DatabaseFeedRepository,
            coupleChannelRepo: DatabaseCoupleChannelRepository,
            photoRepo: DatabasePhotoRepository,
          ) =>
            new UseCaseProxy(
              new CreateFeedUseCases(feedRepo, coupleChannelRepo, photoRepo),
            ),
        },
        {
          inject: [DatabaseFeedLikerRepository, DatabaseFeedRepository],
          provide: UseCasesProxyModule.LIKE_FEED_USECASES_PROXY,
          useFactory: (
            feedLikerRepo: DatabaseFeedLikerRepository,
            feedRepo: DatabaseFeedRepository,
          ) => new UseCaseProxy(new LikeFeedUseCases(feedLikerRepo, feedRepo)),
        },
        {
          inject: [DatabaseFeedRepository],
          provide: UseCasesProxyModule.GET_FEED_USECASES_PROXY,
          useFactory: (feedRepo: DatabaseFeedRepository) =>
            new UseCaseProxy(new GetFeedUseCases(feedRepo)),
        },
        {
          inject: [DatabaseMessageRepository],
          provide: UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY,
          useFactory: (messageRepo: DatabaseMessageRepository) =>
            new UseCaseProxy(new CreateMessageUseCases(messageRepo)),
        },
        {
          inject: [DatabaseMessageRepository],
          provide: UseCasesProxyModule.GET_MESSAGE_USECASES_PROXY,
          useFactory: (messageRepo: DatabaseMessageRepository) =>
            new UseCaseProxy(new GetMessageUseCases(messageRepo)),
        },
        {
          inject: [DatabaseMessageRepository],
          provide: UseCasesProxyModule.READ_MESSAGE_USECASES_PROXY,
          useFactory: (messageRepo: DatabaseMessageRepository) =>
            new UseCaseProxy(new ReadMessageUseCases(messageRepo)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: UseCasesProxyModule.DELETE_USER_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) =>
            new UseCaseProxy(new DeleteUserUseCases(userRepo)),
        },
        {
          inject: [DatabaseFeedRepository],
          provide: UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY,
          useFactory: (feedRepo: DatabaseFeedRepository) =>
            new UseCaseProxy(new UpdateFeedUseCases(feedRepo)),
        },
        {
          inject: [DatabaseFeedRepository],
          provide: UseCasesProxyModule.DELETE_FEED_USECASES_PROXY,
          useFactory: (feedRepo: DatabaseFeedRepository) =>
            new UseCaseProxy(new DeleteFeedUseCases(feedRepo)),
        },
      ],
      exports: [
        UseCasesProxyModule.LOGIN_USECASES_PROXY,
        UseCasesProxyModule.LOGOUT_USECASES_PROXY,

        UseCasesProxyModule.GOOGLE_OAUTH_USECASES_PROXY,
        UseCasesProxyModule.APPLE_OAUTH_USECASES_PROXY,
        UseCasesProxyModule.KAKAO_OAUTH_USECASES_PROXY,

        UseCasesProxyModule.CREATE_USER_USECASES_PROXY,
        UseCasesProxyModule.GET_USER_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_USER_USECASES_PROXY,
        UseCasesProxyModule.PRESIGNED_PROFILE_IMAGE_USECASES_PROXY,
        UseCasesProxyModule.DELETE_USER_USECASES_PROXY,

        UseCasesProxyModule.GENERATE_COUPLE_CODE_USECASES_PROXY,
        UseCasesProxyModule.CREATE_COUPLE_CHANNEL_USECASES_PROXY,
        UseCasesProxyModule.GET_COUPLE_USECASES_PROXY,
        UseCasesProxyModule.ADD_ANNIVERSARY_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_COUPLE_USECASES_PROXY,

        UseCasesProxyModule.PRESIGNED_FEED_IMAGES_USECASES_PROXY,
        UseCasesProxyModule.CREATE_FEED_USECASES_PROXY,
        UseCasesProxyModule.LIKE_FEED_USECASES_PROXY,
        UseCasesProxyModule.GET_FEED_USECASES_PROXY,
        UseCasesProxyModule.UPDATE_FEED_USECASES_PROXY,
        UseCasesProxyModule.DELETE_FEED_USECASES_PROXY,

        UseCasesProxyModule.CREATE_MESSAGE_USECASES_PROXY,
        UseCasesProxyModule.GET_MESSAGE_USECASES_PROXY,
        UseCasesProxyModule.READ_MESSAGE_USECASES_PROXY,
      ],
    };
  }
}
