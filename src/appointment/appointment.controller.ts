import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface AppointmentCreateInput {
  patient_id: string;
  doctor_id: string;
  appoint_date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETE' | 'CANCEL';
  detail?: string;
}

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    let data: AppointmentCreateInput;
    if (req.user.role === 'patient') {
      if (!createAppointmentDto.doctor_id) {
        throw new BadRequestException('doctor_id is required for patient');
      }
      const patient_id = req.user.id;
      data = {
        patient_id,
        doctor_id: createAppointmentDto.doctor_id,
        appoint_date: createAppointmentDto.appoint_date,
        status: createAppointmentDto.status,
      };
    } else if (req.user.role === 'doctor') {
      console.log('================');
      if (!createAppointmentDto.patient_id) {
        throw new BadRequestException('patient_id is required for patient');
      }
      const doctor_id = req.user.id;
      data = {
        patient_id: createAppointmentDto.patient_id,
        doctor_id,
        appoint_date: createAppointmentDto.appoint_date,
        status: 'CONFIRMED',
        detail: createAppointmentDto.detail,
      };
      console.log(data);
    } else {
      throw new BadRequestException(
        'Only patients and doctors can create appointments',
      );
    }

    return this.appointmentService.create(data);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  // for logged-in doctor to get their own appointments
  @UseGuards(JwtAuthGuard)
  @Get('doctor/me')
  findMyAppointments(@Request() req, @Query('status') status?: string) {
    const doctorId = req.user.id;

    if (req.user.role !== 'doctor') {
      throw new BadRequestException(
        'Only doctors can access their appointments',
      );
    }

    return this.appointmentService.findByDoctor(doctorId, status);
  }

  @Get('doctor/:doctor_id')
  findByDoctor(
    @Param('doctor_id') doctorId: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentService.findByDoctor(doctorId, status, date);
  }

  @Patch(':id/detail')
  updateDetail(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateDetail(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateStatus(id, updateAppointmentDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.appointmentService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.appointmentService.remove(+id);
  // }
}
