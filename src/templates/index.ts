import fs from 'fs';
import path from 'path';
import config from '../config';
import ms from 'ms';

export const reset_password_otp_send = ({
  userName,
  otp,
}: {
  userName: string;
  otp: string;
}) =>
  fs
    .readFileSync(
      path.resolve(__dirname, 'reset_password_otp_send.html'),
      'utf-8',
    )
    .replace(
      /\/\* {{CSS}} \*\//g,
      `${fs.readFileSync(path.resolve(__dirname, 'reset_password_otp_send.css'), 'utf-8')}`,
    )
    .replace(/{{SERVER_NAME}}/g, config.server.name)
    .replace(/{{USER_NAME}}/g, userName)
    .replace(
      /{{OTP_NUMBERS}}/g,
      otp
        .split('')
        .map(number => `<span class="otp-number">${number}</span>`)
        .join('\n'),
    )
    .replace(/{{OTP_EXPIRY_TIME}}/g, ms(ms(config.otp.exp), { long: true }))
    .replace(/{{CURRENT_YEAR}}/g, new Date().getFullYear().toString());
