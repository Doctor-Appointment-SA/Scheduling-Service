import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { appointment } from '../../generated/prisma';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}
 
  async create(createAppointmentDto: CreateAppointmentDto): Promise<appointment> {
    const { doctor_id, appoint_date } = createAppointmentDto;

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctor_id, 
        appoint_date,
        status: 'confirmed'
      }
    })

    if (conflict) {
      throw new BadRequestException('This time slot is already booked');
    }

    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  // get all appointment
  async findAll(): Promise<appointment[]> {
    return this.prisma.appointment.findMany();
  }

  // get all doctor appointments with optional status filter
  async findByDoctor(doctorId: string, status?: string) {
    const where: any = { doctor_id: doctorId }; 

    if (status) {
      where.status = status;
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: {
        appoint_date: 'asc',
      }
    })
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} appointment`;
  // }

  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} appointment`;
  // }
}
