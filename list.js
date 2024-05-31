import dotenv from 'dotenv';

dotenv.config();

import { join } from 'path';
import { readFileSync } from 'fs';
import SftpClient from 'ssh2-sftp-client';

async function listFileToSFTP() {
  const sftp = new SftpClient();

  const path = join(process.env.privateKey);
  const privateKey = readFileSync(path);

  await sftp.connect({
    host: process.env.sftpHost,
    port: parseInt(process.env.sftpPort),
    username: process.env.sftpUser,
    privateKey,
    algorithms: {
      cipher: [process.env.algorithm],
    },
  });

  const files = await sftp.list(process.env.path, (item) => {
    return item.name.includes(process.env.fileName);
  });

  console.log('length: ', files.length);

  sftp.end();
}

listFileToSFTP('accrual00001.dsv')
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
