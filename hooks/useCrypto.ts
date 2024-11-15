/**
 * @name useCrypto
 * @category Hooks
 * @createDate 2024-11-15
 * @description 加密解密工具, 即支持Hook使用, 也支持普通函数引入调用
 * @author ZiChun.Guo
 * @param {CryptoHooksProps} props
 * @returns {Object} { encrypt, decrypt }
 * @example
 * const { encrypt, decrypt } = useCrypto({
 *  jwtSecret
 * aesSecret
 * });
 * const encrypted = encrypt({ id: 1, name: "test" });
 * const decrypted = decrypt(encrypted);
 *
 */
import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import JWT from "expo-jwt";
import { SupportedAlgorithms } from "expo-jwt/dist/types/algorithms";
import { JWTBody } from "expo-jwt/dist/types/jwt";
import { useCallback } from "react";

const ivSize = 16; // IV长度保持为16字节

export type CryptoHooksProps = {
  aesSecret: string;
  jwtSecret: string;
};

//MARK - 模拟PHP 中JWT::urlsafeB64Encode($r);加密最后加一步
const urlsafeB64Encode = (data: string) => {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

//MARK - 模拟PHP 中JWT::urlsafeB64Decode($d);解密第一步加一步
const urlsafeB64Decode = (data: string) => {
  return atob(
    data
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(data.length + ((4 - (data.length % 4)) % 4), "=")
  );
};

const generateKey = (aesSecret: string) => {
  return CryptoJS.SHA256(aesSecret); // 用SHA-256生成密钥
};

export const encrypt = (
  content: JWTBody,
  aesSecret: string,
  jwtSecret: string
) => {
  try {
    // 生成JWT并编码
    const jwtContent = JWT.encode(content, jwtSecret, {
      alg: SupportedAlgorithms.HS256,
    });

    const key = generateKey(aesSecret);
    const iv = CryptoJS.lib.WordArray.random(ivSize);

    // AES加密
    const encrypted = CryptoJS.AES.encrypt(jwtContent, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    // 组合IV和密文并转换为Base64
    const encryptedData = iv
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);

    return urlsafeB64Encode(encryptedData);
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decrypt = (
  cipher: string,
  aesSecret: string,
  jwtSecret: string
) => {
  try {
    const key = generateKey(aesSecret);
    const safeCipher = urlsafeB64Decode(cipher);
    const cipherTextBytes = CryptoJS.enc.Base64.parse(safeCipher);

    // 提取IV和密文
    const iv = CryptoJS.lib.WordArray.create(
      cipherTextBytes.words.slice(0, ivSize / 4)
    );
    const cipherTextContent = CryptoJS.lib.WordArray.create(
      cipherTextBytes.words.slice(ivSize / 4)
    );

    // AES解密
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

    const decryptedContent = CryptoJS.enc.Utf8.stringify(decrypted);

    // 解码JWT内容
    return JWT.decode(decryptedContent, jwtSecret);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

// for hooks usage
export function useCrypto(props: CryptoHooksProps) {
  const encryptCallback = useCallback(
    (content: JWTBody) => encrypt(content, props.aesSecret, props.jwtSecret),
    [props.aesSecret, props.jwtSecret]
  );

  const decryptCallback = useCallback(
    (cipher: string) => decrypt(cipher, props.aesSecret, props.jwtSecret),
    [props.aesSecret, props.jwtSecret]
  );

  return {
    encrypt: encryptCallback,
    decrypt: decryptCallback,
  };
}
