import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import JWT from "expo-jwt";
import { SupportedAlgorithms } from "expo-jwt/dist/types/algorithms";
import { JWTBody } from "expo-jwt/dist/types/jwt";

const keySize = 8;
const ivSize = 16;
const iterations = 64;

export type CryptoHooksProps = {
  aesSecret: string;
  jwtSecret: string;
};

export function useCrypto(props: CryptoHooksProps) {
  const salt = CryptoJS.lib.WordArray.random(16);

  return {
    encrypt: (content: JWTBody) => {
      const jwtContent = JWT.encode(content, props.jwtSecret, {
        alg: SupportedAlgorithms.HS256,
      });

      const key = CryptoJS.SHA256(props.aesSecret);

      const iv = CryptoJS.lib.WordArray.random(ivSize);
      const encrypted = CryptoJS.AES.encrypt(jwtContent, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
        hasher: CryptoJS.algo.SHA256,
      });

      const encryptedData = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64);

      return encryptedData;
    },

    decrypt: (chilpher: string) => {
      // const saltLength = 24;
      // const ivLength = 24;

      // 将Base64还原为 `salt`、`iv` 和 `ciphertext`
      // const salt = CryptoJS.enc.Base64.parse(encodeSalt);
      const key = CryptoJS.SHA256(props.aesSecret);
      const cipherTextBytes = CryptoJS.enc.Base64.parse(chilpher);
      const iv = CryptoJS.lib.WordArray.create(
        cipherTextBytes.words.slice(0, 4)
      );
      const cipherTextContent = CryptoJS.lib.WordArray.create(
        cipherTextBytes.words.slice(4)
      );

      const decrypted = CryptoJS.AES.decrypt(
        cipherTextContent.toString(CryptoJS.enc.Base64),
        key,
        {
          mode: CryptoJS.mode.CBC,
          key: key,
          iv: iv,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      // 解码为UTF-8格式并返回原始数据
      const decryptedContent = CryptoJS.enc.Utf8.stringify(decrypted);
      // 解析JWT内容（假设是JSON格式）
      const decodedJWT = JWT.decode(decryptedContent, props.jwtSecret);

      return decodedJWT;
    },
  };
}
