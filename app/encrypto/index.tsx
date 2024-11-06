import { useState } from "react";
import {
  Bone,
  Copy,
  LockKeyhole,
  LockKeyholeOpen,
} from "@tamagui/lucide-icons";
import AES from "crypto-js/aes";
import JWT from "expo-jwt";
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

export const jwtSecret = "8WaeNYzS6EfE03QH";
export const aesSecret = "mW5fW7iY6tP0hZ3yA3vU7rG1eU2qZ1tY";
const EncryptoScreen = () => {
  const toast = useToastController();
  const [plainText, setPlainText] = useState(
    JSON.stringify({ id: 22, name: "test" })
  );
  const [encryptedText, setEnCryptedText] = useState("");

  const clipboardCopy = async () => {
    const successByCopy = await Clipboard.setStringAsync(encryptedText);
    console.log("clipboardCopy", successByCopy, encryptedText);
    const tipsShow = toast.show(successByCopy ? "成功" : "失败", {
      message: successByCopy ? "已复制到剪贴板" : "请重试或手动复制",
    });

    console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");
    console.debug("🐛🐛🐛 ::: tipsShow:::", tipsShow);
    console.debug("🐛🐛🐛 ----------------------------------🐛🐛🐛");
  };

  const handleEncrypt = async () => {};

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
          <LockKeyholeOpen size="$2" color="$red1Dark" />
          <Paragraph color="$gray5Dark" size="$5">
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
      <Stack padding="$2" marginBottom="$2" alignItems="center">
        <Button width="50%" size="$3.5" onPress={handleEncrypt} icon={Bone}>
          加密
        </Button>
      </Stack>

      <YStack padding="$2">
        <XStack
          gap="$2"
          marginBottom="$1"
          justifyContent="flex-start"
          alignContent="center"
        >
          <LockKeyhole size="$2" color="$red1Dark" />
          <Paragraph color="$gray5Dark" size="$5">
            密文:
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
