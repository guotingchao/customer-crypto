import { useState } from "react";
import {
  ClipboardPaste,
  Copy,
  Egg,
  LockKeyhole,
  LockKeyholeOpen,
} from "@tamagui/lucide-icons";

import { ScrollView } from "react-native";

import * as Clipboard from "expo-clipboard";
import { useToastController } from "@tamagui/toast";
import {
  Button,
  Paragraph,
  Stack,
  Text,
  TextArea,
  XStack,
  YStack,
} from "tamagui";

import { useCrypto } from "@/hooks/useCrypto";

const EncryptoScreen = () => {
  const toast = useToastController();
  const encrypto = useCrypto({
    jwtSecret: "8WaeNYzS6EfE03QH",
    aesSecret: "mW5fW7iY6tP0hZ3yA3vU7rG1eU2qZ1tY",
  });
  const [plainText, setPlainText] = useState("");
  const [encryptedText, setEnCryptedText] = useState("");

  const clipboardCopy = async () => {
    const successByCopy = await Clipboard.setStringAsync(plainText);
    toast.show(successByCopy ? "成功" : "失败", {
      message: successByCopy ? "已复制到剪贴板" : "请重试或手动复制",
    });
  };

  const handleClipboardPaste = async () => {
    const content = await Clipboard.getStringAsync();
    setEnCryptedText(content.trim());
    toast.show("成功", {
      message: "已从剪贴板复制成功",
    });
  };

  const handleDencrypt = async () => {
    // step one:
    if (!encryptedText) {
      toast.show("Warning", {
        duration: 3000,
        message: "请先输入密文",
        burntOptions: {
          preset: "error",
        },
      });
      return;
    }

    const content = encrypto.decrypt(encryptedText);
    setPlainText(JSON.stringify(content));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        padding: 20,
      }}
    >
      <YStack padding="$2" gap="$1.25">
        <XStack
          gap="$2"
          marginBottom="$1"
          justifyContent="space-between"
          alignContent="center"
        >
          <Paragraph color="$gray5Dark" size="$5">
            <LockKeyhole size="$1" mx="$1" color="$red1Dark" />
            密文:
          </Paragraph>
          {!encryptedText ? (
            <Button
              size="$2"
              icon={ClipboardPaste}
              onPress={handleClipboardPaste}
            >
              从剪切板复制
            </Button>
          ) : null}
        </XStack>
        <TextArea
          id="encrypted"
          style={{
            borderWidth: 1,
            borderRadius: 10,
            minHeight: 200,
            maxHeight: 400,
          }}
          color="$green10Light"
          padding="$3"
          placeholder="请输入需要加密的内容，点击加密按钮后显示加密后的内容"
          onChangeText={setEnCryptedText}
        >
          {encryptedText}
        </TextArea>
      </YStack>

      <Stack padding="$2" marginBottom="$2" alignItems="center">
        <Button width="50%" size="$3" onPress={handleDencrypt} icon={Egg}>
          解密
        </Button>
      </Stack>
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
        <Text
          id="plain"
          color="$black5"
          style={{
            padding: 10,
            minHeight: 150,
            borderWidth: 1,
            borderColor: "$gray5Dark",
            borderRadius: 10,
          }}
        >
          {plainText}
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
