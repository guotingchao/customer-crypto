import { useState } from "react";
import {
  Bone,
  Copy,
  LockKeyhole,
  LockKeyholeOpen,
  Network,
} from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { useToastController } from "@tamagui/toast";
import {
  ScrollView,
  Button,
  Paragraph,
  Text,
  TextArea,
  XStack,
  YStack,
  H5,
} from "tamagui";
import { useCrypto } from "@/hooks/useCrypto";
import { BASE_URL, cryptoTestRequest } from "@/services/base.service";

const EncryptoScreen = () => {
  const toast = useToastController();
  const encrypto = useCrypto({
    jwtSecret: "8WaeNYzS6EfE03QH",
    aesSecret: "mW5fW7iY6tP0hZ3yA3vU7rG1eU2qZ1tY",
  });
  const [plainText, setPlainText] = useState(
    JSON.stringify({ id: 22, name: "test" })
  );
  const [encryptedText, setEnCryptedText] = useState("");

  const clipboardCopy = async () => {
    const successByCopy = await Clipboard.setStringAsync(encryptedText);
    toast.show(successByCopy ? "成功" : "失败", {
      message: successByCopy ? "已复制到剪贴板" : "请重试或手动复制",
    });
  };

  const handleRemoteEncrypt = async () => {
    const res = await cryptoTestRequest(JSON.parse(plainText));

    console.debug("🐛🐛🐛 ------------------------🐛🐛🐛");
    console.debug("🐛🐛🐛 ::: res:::", res);
    console.debug("🐛🐛🐛 ------------------------🐛🐛🐛");
  };

  const handleEncrypt = async () => {
    if (!plainText) {
      toast.show("Warning", {
        duration: 3000,
        message: "请先输入明文",
        burntOptions: {
          preset: "error",
        },
      });
      return;
    }
    const encrypted = encrypto.encrypt(JSON.parse(plainText));
    setEnCryptedText(encrypted!);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        padding: 20,
      }}
    >
      <YStack padding="$3">
        <XStack
          gap="$2"
          marginBottom="$1"
          justifyContent="flex-start"
          alignContent="center"
        >
          <Paragraph color="$gray5Dark" size="$5">
            <LockKeyholeOpen size="$1" mx="$1" color="$red1Dark" />
            明文
          </Paragraph>
        </XStack>
        <TextArea
          placeholder="输入明文"
          id="plainText"
          onChangeText={setPlainText}
          value={plainText}
          style={{
            padding: 10,
            minHeight: 150,
          }}
        />
      </YStack>
      <XStack m="$2.5" justifyContent="center" alignItems="center" gap="$1">
        <H5 color="$gray5Dark" textAlign="center">
          远程地址:
        </H5>
        <Text
          color="$green10Light"
          textAlign="center"
          style={{ textDecorationLine: "underline" }}
          onPress={() => {
            Clipboard.setStringAsync(BASE_URL);
            toast.show("地址已复制到剪贴板", {
              duration: 3000,
            });
          }}
        >
          {BASE_URL}
        </Text>
      </XStack>
      <XStack
        padding="$2"
        marginBottom="$2"
        alignItems="center"
        gap="$3"
        justifyContent="center"
      >
        <Button onPress={handleEncrypt} icon={Bone}>
          本地加密
        </Button>
        <Button onPress={handleRemoteEncrypt} icon={Network}>
          远程加密测试
        </Button>
      </XStack>
      <YStack padding="$2">
        <XStack
          gap="$2"
          marginBottom="$1"
          justifyContent="flex-start"
          alignContent="center"
        >
          <Paragraph color="$gray5Dark" size="$5">
            <LockKeyhole size="$1" mx="$1" color="$red1Dark" />
            密文/远程报文:
          </Paragraph>
        </XStack>
        <Text
          id="encryptedText"
          style={{ borderWidth: 1, borderRadius: 10, minHeight: 200 }}
          color="$green10Light"
          padding="$3"
          textAlign="left"
          userSelect="text"
        >
          {encryptedText
            ? encryptedText
            : "请输入需要加密的内容，点击加密按钮后显示加密后的内容"}
        </Text>
        <Button
          size="$2"
          icon={Copy}
          circular
          onPress={clipboardCopy}
          alignSelf="flex-end"
          style={{ top: -40, right: 10, position: "relative", zIndex: 999 }}
        ></Button>
      </YStack>
    </ScrollView>
  );
};

export default EncryptoScreen;
