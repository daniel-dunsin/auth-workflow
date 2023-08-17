export const verify_email_html = (username: string, link: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #333333;
          }
          .message {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f8f8;
            border-radius: 5px;
            text-align: center;
          }
          .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 auto;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #999999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="message">
            <p>Hello ${username},</p>
            <p>
              Thank you for signing up! To verify your email address, please click
              the button below:
            </p>
            <p><a class="btn" href="${link}">Verify Email</a></p>
          </div>
          <div class="footer">
            <p>
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </div>
      </body>
    </html>
    `;
};

export const password_reset_email = (
  username: string,
  link: string
) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #333333;
      }
      .message {
        margin-bottom: 20px;
        padding: 10px;
        background-color: #f8f8f8;
        border-radius: 5px;
        text-align: center;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        margin: 0 auto;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #999999;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset</h1>
      </div>
      <div class="message">
        <p>Hello ${username},</p>
        <p>
          We received a request to reset your password. If you didn't make this
          request, you can safely ignore this email.
        </p>
        <p>
          If you did request a password reset, please click the button below to
          reset your password:
        </p>
        <p><a class="btn" href="${link}">Reset Password</a></p>
      </div>
      <div class="footer">
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </div>
  </body>
</html>
`;
