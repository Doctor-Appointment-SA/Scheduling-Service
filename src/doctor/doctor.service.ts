import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { doctor } from '../../generated/prisma';

@Injectable()
export class DoctorService {
  constructor(private Prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<doctor> {
    return this.Prisma.doctor.create({ data: createDoctorDto });
  }

  async findAll(): Promise<doctor[]> {
    return this.Prisma.doctor.findMany();
  }

  async findOne(id: number): Promise<doctor | null> {
    return this.Prisma.doctor.findUnique({where: {id : id.toString()}});
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
