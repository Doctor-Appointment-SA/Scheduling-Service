import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from './prisma/prisma.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [AppointmentModule, PrismaModule, DoctorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
