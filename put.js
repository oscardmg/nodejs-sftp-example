import dotenv from 'dotenv';
dotenv.config();

import { join } from 'path';
import { readFileSync } from 'fs';
import SftpClient from 'ssh2-sftp-client';


async function uploadFileToSFTP(fileName, remoteFile) {
  const sftp = new SftpClient();

  const filePassword = join(process.env.sftpPassword);
  const privateKey = readFileSync(filePassword);

  await sftp.connect({
    host: process.env.sftpHost,
    port: parseInt(process.env.sftpPort),
    username: process.env.sftpUser,
    privateKey,
      algorithms: {
          cipher: [process.env.algorithm],
      },
  });

  
  await sftp.put(fileName, `${process.env.remoteFile}/${fileName}`);


  sftp.end();
}


uploadFileToSFTP('accrual00001.dsv')
.then(() => console.log('Done'))
.catch((e) => console.error(e));