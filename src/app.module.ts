import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AppointmentController } from './appointment/appointment.controller';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from './config/jwt.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppointmentModule,
    PrismaModule,
    DoctorModule,
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes(AppointmentController); // ใช้กับทุก route ของ appointment
    // หรือเจาะจง .forRoutes({ path: 'appointment', method: RequestMethod.POST })
  }
}
