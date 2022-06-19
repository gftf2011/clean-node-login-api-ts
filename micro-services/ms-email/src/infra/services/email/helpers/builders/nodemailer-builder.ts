/**
 * Driver
 */
import * as nodemailer from 'nodemailer'

/**
 * Infra
 */
import { IEmailTransporterBuilder } from '../../../../contracts'

interface TransporterConfig {
  host?: string
  port?: number
  auth?: {
    user: string
    pass: string
  }
}

export class NodemailerTransporterBuilder implements IEmailTransporterBuilder {
  private product: TransporterConfig

  public constructor () {
    this.reset()
  }

  private reset (): void {
    this.product = {}
  }

  public setHost (): void {
    this.product.host = process.env.NODEMAILER_HOST
  }

  public setPort (): void {
    this.product.port = +process.env.NODEMAILER_PORT
  }

  public setUser (): void {
    this.product.auth.user = process.env.NODEMAILER_USER
  }

  public setPass (): void {
    this.product.auth.pass = process.env.NODEMAILER_PASSWORD
  }

  public build (): nodemailer.Transporter {
    const result = nodemailer.createTransport({
      ...this.product
    })
    this.reset()
    return result
  }
}
