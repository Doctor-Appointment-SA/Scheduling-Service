import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { appointment } from '../../generated/prisma';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
 
  async create(createAppointmentDto: CreateAppointmentDto): Promise<appointment> {
    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  // get all appointment
  async findAll(): Promise<appointment[]> {
    return this.prisma.appointment.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
