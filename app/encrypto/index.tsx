import { Bone } from "@tamagui/lucide-icons";
import { useState } from "react";
import { ScrollView } from "react-native";

import { Button, H4, Stack, Text, TextArea, YStack } from "tamagui";

export const jwtSecret = "8WaeNYzS6EfE03QH";
export const aesSecret = "mW5fW7iY6tP0hZ3yA3vU7rG1eU2qZ1tY";
const EncryptoScreen = () => {
  const [plainText, setPlainText] = useState(
    JSON.stringify({ id: 22, name: "test" })
  );
  const [encryptedText, setEnCryptedText] = useState("");
  const handleEncrypt = async () => {
    // console.log("handle encrypt", encryptedText);
    // const aesContent = Aes.encrypt(plainText, aesSecret, "", "aes-256-cbc");
    // console.debug("🐛🐛🐛 --------------------------------------🐛🐛🐛");
    // console.debug("🐛🐛🐛 ::: aesContent:::", aesContent);
    // console.debug("🐛🐛🐛 --------------------------------------🐛🐛🐛");
    // const jwtContent = JWT.encode(JSON.parse(plainText), jwtSecret, {
    //   algorithm: SupportedAlgorithms.HS256,
    // });
    // console.debug(
    //   "🐛🐛🐛 --------------------------------------------------🐛🐛🐛"
    // );
    // console.debug("🐛🐛🐛 ::: jwtContent:::", jwtContent);
    // console.debug(
    //   "🐛🐛🐛 --------------------------------------------------🐛🐛🐛"
    // );
    // setEnCryptedText(jwtContent);
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        padding: 20,
      }}
    >
      <YStack padding="$2">
        <H4 color="$gray5Dark" marginBottom={3}>
          明文:
        </H4>
        <TextArea
          placeholder="输入明文"
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
        <H4 color="$gray5Dark" marginBottom={3}>
          密文:
        </H4>
        <Text
          style={{ borderWidth: 1, borderRadius: 10, minHeight: 200 }}
          color="$green10Light"
          padding="$3"
          textAlign="left"
        >
          {encryptedText
            ? encryptedText
            : "请输入需要加密的内容，点击加密按钮后显示加密后的内容"}
        </Text>
      </YStack>
    </ScrollView>
  );
};

export default EncryptoScreen;
