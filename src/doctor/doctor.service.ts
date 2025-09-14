import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { doctor } from '../../generated/prisma';
import axios from 'axios';

@Injectable()
export class DoctorService {
  constructor(private Prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<doctor> {
    const userRes = await axios.post('http://localhost:4001/api/users', {
      name: createDoctorDto.name,
      lastname: createDoctorDto.lastname,
      password: createDoctorDto.password,
      id_card: createDoctorDto.id_card,
      phone: createDoctorDto.phone,
      role: 'doctor',
    });

    const user = userRes.data;

    return this.Prisma.doctor.create({
      data: {
        id: user.id,
        specialty: createDoctorDto.specialty,
      },
    });
  }

  async findAll(): Promise<doctor[]> {
    return this.Prisma.doctor.findMany({include: { user: true }});
  }

  async findOne(id: number): Promise<doctor | null> {
    return this.Prisma.doctor.findUnique({ where: { id: id.toString() } });
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
