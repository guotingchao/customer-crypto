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
      const key = CryptoJS.PBKDF2(props.aesSecret, salt, {
        keySize,
        iterations: iterations,
      });

      const iv = CryptoJS.lib.WordArray.random(ivSize);

      const encrypted = CryptoJS.AES.encrypt(jwtContent, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
        hasher: CryptoJS.algo.SHA256,
      });

      // console.log(
      //   "Encrypted Result: ",
      //   CryptoJS.enc.Base64.stringify(encrypted.iv),
      //   CryptoJS.enc.Base64.stringify(encrypted.key),
      //   CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
      // );
      return CryptoJS.enc.Base64.stringify(
        salt.concat(iv).concat(encrypted.ciphertext)
      );
    },
    decrypt: (content: String) => {
      const salt = CryptoJS.enc.Hex.parse(content.substring(0, 32));
      const iv = CryptoJS.enc.Hex.parse(content.substring(32, 32));
      const encrypted = content.substring(64);

      const key = CryptoJS.PBKDF2(props.aesSecret, salt, {
        keySize,
        iterations,
      });

      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
        hasher: CryptoJS.algo.SHA256,
      });

      console.debug("🐛🐛🐛 ------------------------------------🐛🐛🐛");
      console.debug("🐛🐛🐛 ::: decrypted:::", decrypted.toString());
      console.debug("🐛🐛🐛 ------------------------------------🐛🐛🐛");

      const jwtContent = JWT.decode(
        decrypted.toString(CryptoJS.enc.Base64),
        props.jwtSecret
      );
      console.log("jwtContent", jwtContent);
      return JSON.stringify(jwtContent);
    },
  };
}
