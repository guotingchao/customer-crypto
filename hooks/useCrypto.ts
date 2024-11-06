import CryptoJS from "crypto-js";
import JWT from "expo-jwt";
import { SupportedAlgorithms } from "expo-jwt/dist/types/algorithms";
import { JWTBody } from "expo-jwt/dist/types/jwt";

const keySize = 8;
const ivSize = 16;
const iterations = 64;

export type CryptoHooksProps<T extends JWTBody | String> = {
  aesSecret: string;
  jwtSecret: string;
  content: T;
};
export function useCrypto() {
  const salt = CryptoJS.lib.WordArray.random(16);

  return {
    encrypt: (props: CryptoHooksProps<JWTBody>) => {
      const jwtContent = JWT.encode(props.content, props.jwtSecret, {
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

      console.log(
        "ciphertext",
        encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      );
      return (
        salt.toString() +
        iv.toString() +
        encrypted.ciphertext.toString(CryptoJS.enc.Base64)
      );
    },
    decrypt: (props: CryptoHooksProps<String>) => {
      const salt = CryptoJS.enc.Base64.parse(props.content.substring(0, 32));
      const iv = CryptoJS.enc.Base64.parse(props.content.substring(32, 32));
      const encrypted = props.content.substring(64);

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

      const jwtContent = JWT.decode(
        decrypted.toString(CryptoJS.enc.Base64),
        props.jwtSecret
      );
      console.log("jwtContent", jwtContent);
      return JSON.stringify(jwtContent);
    },
  };
}
