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
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

interface AppointmentCreateInput {
  patient_id: string;
  doctor_id: string;
  appoint_date: string;
  status: string;
  detail?: string;
}

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    // console.log(req.user)
    let data: AppointmentCreateInput;
    console.log("abcdefg");
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
      console.log("================");
      if (!createAppointmentDto.patient_id) {
        throw new BadRequestException('patient_id is required for patient');
      }
      const doctor_id = req.user.id;
      data = {
        patient_id: createAppointmentDto.patient_id,
        doctor_id,
        appoint_date: createAppointmentDto.appoint_date,
        status: "confirmed",
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
  @Get('doctor/me')
  findMyAppointments(@Request() req, @Query('status') status?: string) {
    const doctorId = req.user.id;

    if (req.user.role !== 'doctor') {
      throw new BadRequestException('Only doctors can access their appointments');
    }

    return this.appointmentService.findByDoctor(doctorId, status);
  }

  @Get('doctor/:doctor_id')
  findByDoctor(@Param('doctor_id') doctorId: string, @Query('status') status?: string) {
    return this.appointmentService.findByDoctor(doctorId, status);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.appointmentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateAppointmentDto: UpdateAppointmentDto,
  // ) {
  //   return this.appointmentService.update(+id, updateAppointmentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.appointmentService.remove(+id);
  // }
}
