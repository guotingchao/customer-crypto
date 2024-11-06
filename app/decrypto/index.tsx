import { useState } from "react";
import {
  Bone,
  Copy,
  LockKeyhole,
  LockKeyholeOpen,
} from "@tamagui/lucide-icons";

import { ScrollView } from "react-native";
import JWT from "expo-jwt";
import AES from "react-native-aes-crypto";

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
  const [plainText, setPlainText] = useState("");
  const [encryptedText, setEnCryptedText] = useState(
    "xjxL2NOweljorCwPg4IDXF/mRDCpYONcpQbD3xvsJmQQIWViKQlJeseO535jW0NKyk/3wWznA1FjpV81F6oV8enlr3BHJ8ZZRIZ+J+eTbrmUB2VKZswAxYVVSKEOGcM4Hm3RQqNEOIN9PFdOkEBfjTgemTmQaNMGKVCiLaQepkA="
  );

  const clipboardCopy = async () => {
    const successByCopy = await Clipboard.setStringAsync(plainText);
    toast.show(successByCopy ? "成功" : "失败", {
      message: successByCopy ? "已复制到剪贴板" : "请重试或手动复制",
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
    console.debug("🐛🐛🐛 --------------------------------------------🐛🐛🐛");
    console.debug("🐛🐛🐛 ::: encryptedText:::", encryptedText);
    console.debug("🐛🐛🐛 --------------------------------------------🐛🐛🐛");
    const jwtClipher = await AES.decrypt(
      encryptedText,
      aesSecret,
      "50b2be42a6cab00c379d593be9e74fe6",
      "aes-256-cbc"
    );

    console.debug("🐛🐛🐛 --------------------------------------🐛🐛🐛");
    console.debug("🐛🐛🐛 ::: Decode jwtClipher:::", jwtClipher);
    console.debug("🐛🐛🐛 --------------------------------------🐛🐛🐛");

    const plainContent = JWT.decode(jwtClipher, jwtSecret);
    console.debug(
      "🐛🐛🐛 --------------------------------------------------🐛🐛🐛"
    );
    console.debug("🐛🐛🐛 ::: Decode plainContent:::", plainContent);
    console.debug(
      "🐛🐛🐛 --------------------------------------------------🐛🐛🐛"
    );

    // setPlainText(plainContent.toString());
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
          justifyContent="flex-start"
          alignContent="center"
        >
          <LockKeyhole size="$2" color="$red1Dark" />
          <Paragraph color="$gray5Dark" size="$5">
            密文:
          </Paragraph>
        </XStack>
        <TextArea
          id="encrypted"
          style={{ borderWidth: 1, borderRadius: 10, minHeight: 200 }}
          color="$green10Light"
          padding="$3"
          placeholder="请输入需要加密的内容，点击加密按钮后显示加密后的内容"
          onChangeText={setEnCryptedText}
        >
          {encryptedText}
        </TextArea>
      </YStack>

      <Stack padding="$2" marginBottom="$2" alignItems="center">
        <Button width="50%" size="$3.5" onPress={handleDencrypt} icon={Bone}>
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
          <LockKeyholeOpen size="$2" color="$red1Dark" />
          <Paragraph color="$gray5Dark" size="$5">
            明文
          </Paragraph>
        </XStack>
        <Text
          id="plain"
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
