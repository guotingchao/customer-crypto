### App 对称加密 & JWT 调研 与 实现

### Use Case

#### Running on iOS

🚀 Follow these steps to get the app running on your iOS device:

1. **Install Dependencies** 📦

```bash
npx expo install
```

2. **Install Pods** 🍫

```bash
npx pod-install
cd ..
```

3. **Running** 🛠️

```bash
npx expo run:ios
```

4. **Modify App Transport Security** ⚠️
   > find Info.plist in ios/cryptoCustomer/Info.plist

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

4. **Enjoy!** 🎉

- Your app should now be running on your iOS device.

### Test instructions

> Running on IOS device and simulator sdk 16.5 - 18.0
