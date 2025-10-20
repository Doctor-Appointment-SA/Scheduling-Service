import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { appointment } from '../../generated/prisma';
import { thaiDayToUtc } from 'src/utils/tims';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<appointment> {
    const { doctor_id, appoint_date } = createAppointmentDto;

    const now = new Date();
    const appointDate = new Date(appoint_date);

    console.log(now, appointDate);
    console.log(now.getTime(), appointDate.getTime());

    if (appointDate.getTime() < now.getTime()) {
      throw new BadRequestException('Cannot book appointment in the past');
    }

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctor_id,
        appoint_date,
        status: 'CONFIRMED',
      },
    });

    if (conflict) {
      throw new BadRequestException('This time slot is already booked');
    }

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.appointment.create({
        data: createAppointmentDto,
      });

      if (created.status === 'CONFIRMED') {
        await tx.appointment.updateMany({
          where: {
            doctor_id,
            appoint_date,
            status: 'PENDING',
            id: { not: created.id },
          },
          data: {
            status: 'CANCEL',
          },
        });
      }
      return created;
    });
  }

  // get all appointment
  async findAll(): Promise<appointment[]> {
    return this.prisma.appointment.findMany();
  }

  // get all doctor appointments with optional status filter
  async findByDoctor(
    doctorId: string,
    status?: string,
    date?: string,
  ): Promise<appointment[]> {
    const where: any = { doctor_id: doctorId };

    if (status) {
      where.status = status;
    }

    if (date) {
      const { startUtc, endUtc } = thaiDayToUtc(date);
      where.appoint_date = {
        gte: startUtc,
        lt: endUtc,
      };
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: {
        appoint_date: 'asc',
      },
      include: {
        patient: {
          include: {
            user_patient_idTouser: {
              select: {
                name: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
  }

  async updateDetail(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.findUnique({
        where: { id },
      });
      if (!appt) {
        throw new BadRequestException('Appointment not found');
      }

      const updated = await tx.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      });

      return updated;
    });
  }

  async updateStatus(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.findUnique({
        where: { id },
      });

      if (!appt) {
        throw new BadRequestException('Appointment not found');
      }

      const willConfirm = updateAppointmentDto.status === 'CONFIRMED';

      // If confirming, check for conflicts
      if (willConfirm) {
        const conflict = await tx.appointment.findFirst({
          where: {
            doctor_id: appt.doctor_id,
            appoint_date: appt.appoint_date,
            status: 'CONFIRMED',
          },
        });

        if (conflict) {
          throw new BadRequestException('This time slot is already booked');
        }
      }

      const updated = await tx.appointment.update({
        where: { id },
        data: updateAppointmentDto,
      });

      // cancel all other pending appointments if confirmed
      if (updated.status === 'CONFIRMED') {
        await tx.appointment.updateMany({
          where: {
            doctor_id: appt.doctor_id,
            appoint_date: appt.appoint_date,
            status: 'PENDING',
            id: { not: appt.id },
          },
          data: {
            status: 'CANCEL',
          },
        });
      }
      return updated;
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} appointment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} appointment`;
  // }
}
