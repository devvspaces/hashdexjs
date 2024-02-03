import { Injectable } from '@nestjs/common';
import { UserM } from '../../domain/model/user';
import { CreateUser, UserRepository } from '../../domain/repositories/userRepository.interface';
import { PrismaService } from '@infrastructure/config/prisma/prisma.service';

@Injectable()
export class UserRepositoryImp implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(id: string): Promise<UserM> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<UserM> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async createUser(data: CreateUser): Promise<UserM> {
    return this.prismaService.user.create({
      data
    })
  }

  async setHashnodePat(id: string, hashnodePat: string): Promise<UserM> {
    return this.prismaService.user.update({
      where: { id },
      data: {
        hashnodePat
      }
    })
  }

  async updateLastLogin(email: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
