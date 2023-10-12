import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from 'expo-constants';

export default class Device {
    static readonly isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    static readonly isAndroid = Platform.OS == "android";
    static readonly isIOS = Platform.OS == "ios";

    static get isDevice() {
        return this.isAndroid || this.isIOS;
    }
}