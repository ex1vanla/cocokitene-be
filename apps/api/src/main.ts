import { ApiModule } from '@api/modules/api.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from '@shares/exception-filter'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { ResponseTransformInterceptor } from '@shares/interceptors/response.interceptor'
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(ApiModule)

    const config = app.get<ConfigService>(ConfigService)
    const globalPrefix = config.get('api.prefix')

    app.enableCors()
    app.setGlobalPrefix(globalPrefix)
    // app.useGlobalInterceptors(new SentryInterceptor())
    app.useGlobalInterceptors(new ResponseTransformInterceptor())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    )

    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()))
    // app.useGlobalGuards(new JwtAuthGuard())
    // app.useGlobalGuards(new RolesGuard(new Reflector()))

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Cocokitene API docs')
        .setDescription('Cocokitene API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    })

    const port = config.get('api.port')

    await app.listen(port)
    Logger.log(`🚀 Api application is running on: ${await app.getUrl()}`)
}
bootstrap()
