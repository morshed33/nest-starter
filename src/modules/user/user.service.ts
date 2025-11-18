import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/wasm';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[] | []> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...(updateUserDto.email && { email: updateUserDto.email }),
          ...(updateUserDto.name !== undefined && { name: updateUserDto.name }),
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
