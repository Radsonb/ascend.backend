import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (user) {
      throw new ConflictException('Usuário já cadastrado');
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createdUser = await prisma.user.create({
          data: {
            email: data.email,
            password: hashedPassword
          }
        });

        await prisma.profile.create({
          data: {
            name: data.profile.name,
            phone_number: data.profile.phone_number,
            birth_date: data.profile.birth_date,
            weight: data.profile.weight,
            height: data.profile.height,
            user: { connect: { id: createdUser.id } }
          }
        });

        await prisma.address.create({
          data: {
            ...data.address,
            user: { connect: { id: createdUser.id } }
          }
        });

        return { id: createdUser.id, email: createdUser.email };
      });

      return {
        message: 'Usuário registrado com sucesso',
        user: result
      };
    } catch (error) {
      this.logger.error('Erro ao registrar usuário', error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Usuário já cadastrado');
      }

      throw new InternalServerErrorException(
        'Não foi possível registrar o usuário. Tente novamente.',
      );
    }
  }
}
