import { useRouter } from "expo-router";
import { StepForward, Star, Package, PackageOpen } from "@tamagui/lucide-icons";
import {
  YGroup,
  ListItem,
  Card,
  H2,
  Paragraph,
  Button,
  XStack,
  YStack,
  ScrollView,
} from "tamagui";
import { useNetworkState } from "expo-network";

const Home = () => {
  const routers = useRouter();
  const networkState = useNetworkState();

  console.debug("🐛🐛🐛 ------------------------------------------🐛🐛🐛");
  console.debug("🐛🐛🐛 ::: networkState:::", networkState.type);
  console.debug("🐛🐛🐛 ::: networkState:::", networkState.isConnected);
  console.debug("🐛🐛🐛 ::: networkState:::", networkState.isInternetReachable);
  console.debug("🐛🐛🐛 ------------------------------------------🐛🐛🐛");

  return (
    <ScrollView
      backgroundColor="$background"
      paddingVertical="$5"
      paddingHorizontal="$3"
    >
      <XStack
        padding="$2"
        gap="$5"
        justifyContent="center"
        alignContent="center"
      >
        <Card
          elevate
          size="$4"
          bordered
          animation="bouncy"
          width={150}
          height={150}
          hoverStyle={{ scale: 0.925 }}
          pressStyle={{ scale: 0.875 }}
          padding="$2"
        >
          <Card.Header>
            <H2>加密</H2>
            <Paragraph theme="alt2">Encrypto</Paragraph>
          </Card.Header>
          <Card.Footer>
            <XStack flex={1} />
            <Button
              borderRadius="$10"
              onPress={() => {
                routers.push("/encrypto");
              }}
            >
              进入
            </Button>
          </Card.Footer>
          <Card.Background
            paddingLeft="$2"
            paddingBottom="$2"
            justifyContent="flex-end"
            alignContent="flex-end"
            alignItems="flex-start"
            fullscreen
          >
            <Package size={35} />
          </Card.Background>
        </Card>

        <Card
          elevate
          size="$4"
          bordered
          animation="bouncy"
          width={150}
          height={150}
          hoverStyle={{ scale: 0.925 }}
          pressStyle={{ scale: 0.875 }}
          onPress={() => routers.push("/encrypto")}
          padding="$2"
        >
          <Card.Header>
            <H2>解密</H2>
            <Paragraph theme="alt2">Decypto</Paragraph>
          </Card.Header>
          <Card.Footer>
            <XStack flex={1} />
            <Button
              borderRadius="$10"
              onPress={() => {
                routers.push("/decrypto");
              }}
            >
              进入
            </Button>
          </Card.Footer>
          <Card.Background
            paddingLeft="$2"
            paddingBottom="$2"
            justifyContent="flex-end"
            alignContent="flex-end"
            alignItems="flex-start"
          >
            <PackageOpen size={35} />
          </Card.Background>
        </Card>
      </XStack>
      <YStack marginTop="$10">
        <YGroup size="$2" borderRadius="$7">
          <YGroup.Item>
            <ListItem hoverTheme icon={Star} title="加密/解密 步骤如下: " />
          </YGroup.Item>
          <YGroup.Item>
            <ListItem hoverTheme icon={StepForward}>
              1. 明文 -&gt; 先进行AES解密/（加密）
            </ListItem>
          </YGroup.Item>
          <YGroup.Item>
            <ListItem hoverTheme icon={StepForward}>
              2. AES -&gt; 进行JWT解密/（加密）
            </ListItem>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </ScrollView>
  );
};

export default Home;
