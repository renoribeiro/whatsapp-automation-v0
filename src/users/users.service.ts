import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { UserRole } from "@prisma/client"
import * as bcrypt from "bcryptjs"

import type { PrismaService } from "../prisma/prisma.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId?: string, agencyId?: string) {
    const where: any = {}

    if (companyId) {
      where.companyId = companyId
    }

    if (agencyId) {
      where.agencyId = agencyId
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
        agencyId: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    return user
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        agency: true,
      },
    })
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email)

    if (existingUser) {
      throw new BadRequestException("Email já está em uso")
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12)

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id)

    const updateData: any = { ...updateUserDto }

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 12)
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    await this.findById(id)

    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    })
  }

  async getActiveSellersByCompany(companyId: string) {
    return this.prisma.user.count({
      where: {
        companyId,
        role: UserRole.SELLER,
        isActive: true,
      },
    })
  }
}
