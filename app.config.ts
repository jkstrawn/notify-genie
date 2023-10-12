import { ConfigContext, ExpoConfig } from "@expo/config";

const assetUrl = "./src/assets/images";

export default ({ config }: ConfigContext): ExpoConfig => ({
    name: "Notify G",
    slug: "notify-genie",
    version: "0.0.1",
    orientation: "portrait",
    icon: `${assetUrl}/icon.png`,
    scheme: "notifygenie",
    userInterfaceStyle: "automatic",
    splash: {
        resizeMode: "contain",
        backgroundColor: "#5e71bc",
    },
    assetBundlePatterns: [
        "**/*",
    ],
    notification: {
        icon: `${assetUrl}/notification-icon.png`,
        color: "#5e71bc",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: `${assetUrl}/adaptive-icon.png`,
            backgroundColor: "#5e71bc",
        },
        package: "com.rindle.notifygenie",
        googleServicesFile: "./config/google-services.json",
        softwareKeyboardLayoutMode: "pan",
    },
    plugins: [
        "@react-native-firebase/app",
        "expo-notifications",
        [
            "expo-build-properties",
            {
                ios: {
                    useFrameworks: "static",
                }
            }
        ],
    ],
    extra: {
        eas: {
            projectId: "13250553-3ef7-4434-9610-ff9d0a2931c5",
        }
    },
});