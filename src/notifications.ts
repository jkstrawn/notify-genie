import Device from "./device";
import * as ExpoNotifications from 'expo-notifications';
import Firebase from "./firebase";
import DeviceStorage, { StorageKey } from "./storage";

type TokenSuccess = {
    success: true;
    token: string;
}

type TokenFailure = {
    errorTitle: string;
    errorMessage: string;
}

type TokenResponse = TokenSuccess | TokenFailure;

export enum NotificationSettingState {
    active = "active",
    error = "error", // this means the token is invalid and needs to be updated
}

export interface NotificationSettings {
    state: NotificationSettingState;
    token?: string;
}

export default class Notifications {
    static settings?: NotificationSettings;

    static async load() {
        const settings = await DeviceStorage.getObject<NotificationSettings>(StorageKey.NOTIFICATION_SETTINGS);
        
        console.log("token settings:");
        console.log(JSON.stringify(settings));

        if (settings) {
            this.settings = settings;
        }
    }

    private static async setUserSettings(state: NotificationSettingState, token?: string) {
        console.log(`Setting notification prompt state to [${state}]`);

        this.settings = { state, token };

        await DeviceStorage.setObject(StorageKey.NOTIFICATION_SETTINGS, this.settings);
    }

    static async register() {
        console.log("Beginning push notification registration");

        if (Device.isAndroid) {
            ExpoNotifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: ExpoNotifications.AndroidImportance.MAX,
                // vibrationPattern: [0, 250, 250, 250],
                // lightColor: '#FF231F7C',
            });
        }

        const token = await this.generateToken();
        if (!this.isTokenSuccess(token)) {
            console.error(token.errorTitle, token.errorMessage);

            return Promise.reject();
        }

        console.log("Token generated successfully");

        await this.setUserSettings(NotificationSettingState.active, token.token);
    }


    // static async unregister(user: NotificationUserSetting) {
    //     const unregistered = await this.sendUnregisterRequest(user.token || "", user.agency, user.username);

    //     if (unregistered) {
    //         console.log({
    //             title: "successTitle",
    //             message: "unregisteredSuccessMessage",
    //         });
    //     } else {
    //         console.log({
    //             title: "errorTitle",
    //             message: "unregisteredErrorMessage",
    //         });
    //     }
    // }

    static async generateToken(): Promise<TokenResponse> {
        if (!Device.isDevice) {
            console.log("Not a device, skipping push notification registration");
            return {
                errorTitle: "errorTitle",
                errorMessage: "notSupportedMessage",
            };
        }

        const hasPermission = await this.getPermission();
        if (!hasPermission) {
            console.log("User has not granted permission for push notifications");
            return {
                errorTitle: "permissionDeniedTitle",
                errorMessage: "permissionDeniedMessage",
            };
        }

        if (Device.isAndroid && Device.isExpoGo) {
            // firebase doesn't work with expo go, so get a token from expo if it's an android device
            return {
                success: true,
                token: (await ExpoNotifications.getDevicePushTokenAsync()).data,
            };
        }

        const token = await Firebase.getToken();
        if (!token) {
            console.error("Failed to get token for push notification");
            return {
                errorTitle: "errorTitle",
                errorMessage: "registrationErrorMessage",
            };
        }

        return { token, success: true };
    }

    private static async getPermission(): Promise<boolean> {
        const status = await ExpoNotifications.getPermissionsAsync();

        if (status.status != 'granted') {
            const updatedStatus = await ExpoNotifications.requestPermissionsAsync();
            return updatedStatus.status == 'granted';
        }

        return true;
    }

    static isTokenSuccess(item: TokenResponse): item is TokenSuccess {
        return !!(item as TokenSuccess).token;
        // return 'token' in item;
    }
}