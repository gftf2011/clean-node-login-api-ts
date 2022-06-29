/**
 * Use Cases
 */
import { BasicUserDto, EmailTemplate } from '../../use-cases/ports'

export class WelcomeEmailTemplate implements EmailTemplate {
  html(data: object): string {
    const { name } = data as BasicUserDto
    return `<div style="max-width: 600px">
          <main style="
            font-family: 'Helvetica', sans-serif;
            margin-left: auto;
            margin-right: auto;
            margin-top: -80px;
            border-radius: 4px;
            max-width: 480px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 32px;"
          >
            <h1 style="
              font-size: 48px;
              font-weight: 100;
              margin-top: 20px;
              text-align: center;
              color: #161640;"
            >
              ACME
            </h1>
            <div style="
              margin-top: 12px;
              font-size: 72px;
              text-align: center;"
            >
              👋
            </div>
            <h2 style="
              font-size: 20px;
              font-weight: 400;
              text-align: center;
              margin-top: 36px;
              color: #161640;"
            >
              Hi, Welcome aboard <strong>${name}</strong> !
            </h2>
            <h3 style="
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              margin-top: 8px;
              color: #161640;"
            >
              Congrats for signing up !
            </h3>
            <p style="
              font-size: 14px;
              font-weight: 400;
              text-align: center;
              margin-top: 24px;
              color: #161640;"
            >
              Thank you for using our services, our team will guide you if you have any doubts ralated to services, or platform usage !
            </p>
            <hr style="
              border-top: 2px solid #2263e0;
              max-width: 32px;
              margin-left: auto;
              margin-right: auto;
              margin-top: 16px;"
            />
            <p style="
              font-size: 14px;
              font-weight: 400;
              text-align: center;
              margin-top: 16px;
              color: #161640;"
            >
              This a welcome message email !
              <br />
              Please do not reply it 😎 !
            </p>
          </main>
        </div>`
  }

  attachments(): object[] {
    return []
  }
}
