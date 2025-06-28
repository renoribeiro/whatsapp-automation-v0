import { Injectable, Logger } from "@nestjs/common"
import OpenAI from "openai"

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name)

  async testConnection(config: any) {
    try {
      const openai = new OpenAI({
        apiKey: config.apiKey,
      })

      const response = await openai.models.list()

      return {
        success: true,
        modelsCount: response.data.length,
      }
    } catch (error) {
      this.logger.error(`OpenAI test connection error: ${error.message}`)
      throw error
    }
  }

  async generateResponse(config: any, data: any) {
    try {
      const openai = new OpenAI({
        apiKey: config.apiKey,
      })

      const prompt = this.buildPrompt(config, data)

      const response = await openai.chat.completions.create({
        model: config.model || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: config.systemPrompt || "Você é um assistente útil para atendimento ao cliente.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens || 150,
        temperature: config.temperature || 0.7,
      })

      const generatedText = response.choices[0]?.message?.content || ""

      this.logger.log("OpenAI response generated successfully")

      return {
        success: true,
        response: generatedText,
        usage: response.usage,
      }
    } catch (error) {
      this.logger.error(`OpenAI generate response error: ${error.message}`)
      throw error
    }
  }

  private buildPrompt(config: any, data: any): string {
    let prompt = data.message || data.content || ""

    // Adicionar contexto se disponível
    if (data.contact) {
      prompt += `\n\nContexto do contato:\n`
      prompt += `Nome: ${data.contact.name || "Não informado"}\n`
      prompt += `Telefone: ${data.contact.phoneNumber}\n`
      if (data.contact.leadSource) {
        prompt += `Fonte: ${data.contact.leadSource}\n`
      }
    }

    // Adicionar instruções personalizadas
    if (config.customInstructions) {
      prompt += `\n\nInstruções: ${config.customInstructions}`
    }

    return prompt
  }
}
