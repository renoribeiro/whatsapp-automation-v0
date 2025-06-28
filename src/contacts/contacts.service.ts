import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateContactDto } from "./dto/create-contact.dto"
import type { UpdateContactDto } from "./dto/update-contact.dto"
import type { ImportContactsDto } from "./dto/import-contacts.dto"

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const { phoneNumber, companyId } = createContactDto

    // Verificar se o contato já existe para esta empresa
    const existingContact = await this.prisma.contact.findUnique({
      where: {
        phoneNumber_companyId: {
          phoneNumber,
          companyId,
        },
      },
    })

    if (existingContact) {
      throw new BadRequestException("Contato já existe para esta empresa")
    }

    return this.prisma.contact.create({
      data: createContactDto,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = { companyId }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { phoneNumber: { contains: filters.search } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    if (filters?.leadSource) {
      where.leadSource = filters.leadSource
    }

    if (filters?.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: filters.tagIds,
          },
        },
      }
    }

    if (filters?.isBlocked !== undefined) {
      where.isBlocked = filters.isBlocked
    }

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          _count: {
            select: {
              conversations: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.contact.count({ where }),
    ])

    return {
      contacts,
      total,
      hasMore: (filters?.skip || 0) + contacts.length < total,
    }
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        conversations: {
          include: {
            whatsappConnection: {
              select: {
                id: true,
                phoneNumber: true,
                displayName: true,
              },
            },
            assignedUser: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                messages: true,
              },
            },
          },
          orderBy: {
            lastActivity: "desc",
          },
        },
      },
    })

    if (!contact) {
      throw new NotFoundException("Contato não encontrado")
    }

    return contact
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    await this.findOne(id)

    return this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.contact.delete({
      where: { id },
    })
  }

  async addTag(contactId: string, tagId: string) {
    const contact = await this.findOne(contactId)

    // Verificar se a tag pertence à mesma empresa
    const tag = await this.prisma.tag.findFirst({
      where: {
        id: tagId,
        companyId: contact.companyId,
      },
    })

    if (!tag) {
      throw new NotFoundException("Tag não encontrada ou não pertence a esta empresa")
    }

    // Verificar se a tag já está associada
    const existingAssociation = await this.prisma.contactTag.findUnique({
      where: {
        contactId_tagId: {
          contactId,
          tagId,
        },
      },
    })

    if (existingAssociation) {
      throw new BadRequestException("Tag já está associada a este contato")
    }

    await this.prisma.contactTag.create({
      data: {
        contactId,
        tagId,
      },
    })

    return this.findOne(contactId)
  }

  async removeTag(contactId: string, tagId: string) {
    await this.findOne(contactId)

    const association = await this.prisma.contactTag.findUnique({
      where: {
        contactId_tagId: {
          contactId,
          tagId,
        },
      },
    })

    if (!association) {
      throw new NotFoundException("Associação não encontrada")
    }

    await this.prisma.contactTag.delete({
      where: {
        contactId_tagId: {
          contactId,
          tagId,
        },
      },
    })

    return this.findOne(contactId)
  }

  async blockContact(id: string) {
    await this.findOne(id)

    return this.prisma.contact.update({
      where: { id },
      data: { isBlocked: true },
    })
  }

  async unblockContact(id: string) {
    await this.findOne(id)

    return this.prisma.contact.update({
      where: { id },
      data: { isBlocked: false },
    })
  }

  async importContacts(companyId: string, importContactsDto: ImportContactsDto) {
    const { contacts } = importContactsDto
    const results = {
      imported: 0,
      skipped: 0,
      errors: [],
    }

    for (const contactData of contacts) {
      try {
        // Verificar se já existe
        const existing = await this.prisma.contact.findUnique({
          where: {
            phoneNumber_companyId: {
              phoneNumber: contactData.phoneNumber,
              companyId,
            },
          },
        })

        if (existing) {
          results.skipped++
          continue
        }

        await this.prisma.contact.create({
          data: {
            ...contactData,
            companyId,
          },
        })

        results.imported++
      } catch (error) {
        results.errors.push({
          phoneNumber: contactData.phoneNumber,
          error: error.message,
        })
      }
    }

    return results
  }

  async getContactStats(companyId: string) {
    const [total, blocked, withTags, byLeadSource] = await Promise.all([
      this.prisma.contact.count({
        where: { companyId },
      }),
      this.prisma.contact.count({
        where: { companyId, isBlocked: true },
      }),
      this.prisma.contact.count({
        where: {
          companyId,
          tags: {
            some: {},
          },
        },
      }),
      this.prisma.contact.groupBy({
        by: ["leadSource"],
        where: { companyId },
        _count: true,
      }),
    ])

    return {
      total,
      blocked,
      withTags,
      byLeadSource,
    }
  }
}
