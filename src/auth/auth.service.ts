import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"
import * as bcrypt from "bcryptjs"

import type { PrismaService } from "../prisma/prisma.service"
import type { UsersService } from "../users/users.service"
import type { LoginDto } from "./dto/login.dto"
import type { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas")
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Usuário inativo")
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      agencyId: user.agencyId,
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN", "30d"),
    })

    // Log da atividade
    await this.prisma.activityLog.create({
      data: {
        action: "LOGIN",
        description: "Usuário fez login no sistema",
        userId: user.id,
        companyId: user.companyId,
      },
    })

    return {
      user,
      accessToken,
      refreshToken,
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email)

    if (existingUser) {
      throw new BadRequestException("Email já está em uso")
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      Number.parseInt(this.configService.get("BCRYPT_ROUNDS", "12")),
    )

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })

    return user
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      })

      const user = await this.usersService.findById(payload.sub)

      if (!user || !user.isActive) {
        throw new UnauthorizedException("Token inválido")
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        agencyId: user.agencyId,
      }

      const accessToken = this.jwtService.sign(newPayload)

      return { accessToken }
    } catch (error) {
      throw new UnauthorizedException("Token inválido")
    }
  }
}
