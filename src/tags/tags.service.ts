import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateTagDto } from "./dto/create-tag.dto"
import type { UpdateTagDto } from "./dto/update-tag.dto"

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const { name, companyId } = createTagDto

    // Verificar se já existe uma tag com este nome para esta empresa
    const existingTag = await this.prisma.tag.findUnique({
      where: {
        name_companyId: {
          name,
          companyId,
        },
      },
    })

    if (existingTag) {
      throw new BadRequestException("Já existe uma tag com este nome para esta empresa")
    }

    return this.prisma.tag.create({
      data: createTagDto,
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })
  }

  async findAll(companyId: string) {
    return this.prisma.tag.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })

    if (!tag) {
      throw new NotFoundException("Tag não encontrada")
    }

    return tag
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id)

    // Se está mudando o nome, verificar se não existe outra tag com o mesmo nome
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const existingTag = await this.prisma.tag.findUnique({
        where: {
          name_companyId: {
            name: updateTagDto.name,
            companyId: tag.companyId,
          },
        },
      })

      if (existingTag) {
        throw new BadRequestException("Já existe uma tag com este nome para esta empresa")
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    // Remover todas as associações com contatos primeiro
    await this.prisma.contactTag.deleteMany({
      where: { tagId: id },
    })

    return this.prisma.tag.delete({
      where: { id },
    })
  }

  async reorderTags(companyId: string, tagOrders: { id: string; order: number }[]) {
    const tags = await this.prisma.tag.findMany({
      where: { companyId },
      select: { id: true },
    })

    const tagIds = tags.map((tag) => tag.id)

    // Verificar se todas as tags pertencem à empresa
    for (const tagOrder of tagOrders) {
      if (!tagIds.includes(tagOrder.id)) {
        throw new BadRequestException(`Tag ${tagOrder.id} não pertence a esta empresa`)
      }
    }

    // Atualizar ordem das tags
    const updatePromises = tagOrders.map((tagOrder) =>
      this.prisma.tag.update({
        where: { id: tagOrder.id },
        data: { order: tagOrder.order },
      }),
    )

    await Promise.all(updatePromises)

    return this.findAll(companyId)
  }

  async getTagStats(companyId: string) {
    const tags = await this.prisma.tag.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            contacts: true,
          },
        },
      },
      orderBy: {
        contacts: {
          _count: "desc",
        },
      },
    })

    const totalTags = tags.length
    const totalContacts = await this.prisma.contact.count({
      where: { companyId },
    })
    const contactsWithTags = await this.prisma.contact.count({
      where: {
        companyId,
        tags: {
          some: {},
        },
      },
    })

    return {
      totalTags,
      totalContacts,
      contactsWithTags,
      contactsWithoutTags: totalContacts - contactsWithTags,
      tagUsage: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        contactCount: tag._count.contacts,
      })),
    }
  }
}
