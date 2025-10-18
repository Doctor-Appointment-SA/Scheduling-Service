import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { doctor } from '../../generated/prisma';

@Injectable()
export class DoctorService {
  constructor(private Prisma: PrismaService) {}

  async create(dto: CreateDoctorDto) {
    return this.Prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          lastname: dto.lastname,
          password: dto.password,
          id_card: dto.id_card,
          phone: dto.phone,
          role: 'doctor',
        },
        select: { id: true },
      });

      const doctor = await tx.doctor.create({
        data: {
          id: user.id,
          specialty: dto.specialty,
        },
      });
      
      return doctor;
    });
  }

  async findAll(): Promise<doctor[]> {
    return this.Prisma.doctor.findMany({ include: { user: true } });
  }

  // async findOne(id: number): Promise<doctor | null> {
  //   return this.Prisma.doctor.findUnique({ where: { id: id.toString() } });
  // }

  // update(id: number, updateDoctorDto: UpdateDoctorDto) {
  //   return `This action updates a #${id} doctor`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} doctor`;
  // }
}
