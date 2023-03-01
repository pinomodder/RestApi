const axios = require("axios");
const fs = require("fs");
const { fromBuffer } = require("file-type");
const path = require("path");
const Crypto = require("crypto");
const { tmpdir } = require("os");
const tmp = path.join(
  tmpdir(),
  `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}`
);
async function uploadFile(buffer) {
  const cek_file = await fromBuffer(buffer);
  fs.writeFile(tmp + `.${cek_file.ext}`);
  const bodyForm = new FormData();
  bodyForm.append("files[]", fs.createReadStream(path));
  await axios(`https://uguu.se/upload.php`, {
    method: "POST",
    data: bodyForm,
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,id;q=0.8",
      "content-type": `multipart/form-data; boundary=${bodyForm._boundary}`,
    },
  }).then(({ data }) => {
    return data.files[0].name;
  });
}
module.exports = uploadFile;
