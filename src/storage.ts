import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKey {
    NOTIFICATION_SETTINGS = "NOTIFICATION_SETTINGS",
}

export default class DeviceStorage {

    static async getString(key: string): Promise<string | undefined> {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (e) {
            console.log(`${e} - Failed to retrieve item (${key}) from storage`);
        }

        return undefined;
    }

    static async getNumber(key: string): Promise<number | undefined> {
        const value = await this.getString(key);
        if (value) {
            return parseInt(value);
        }
    }

    static async getObject<T>(key: string): Promise<T | undefined> {
        const value = await this.getString(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                console.error(`${e} - Failed to parse object from storage key ${key}: ${value.substring(0, 100)}...`);
                return undefined;
            }
        }
    }

    static async deleteKey(key: string): Promise<void> {
        await AsyncStorage.removeItem(key);
    }

    static async setString(key: string, value: string | undefined): Promise<void> {
        try {
            if (value == undefined) {
                await this.deleteKey(key);
            } else {
                await AsyncStorage.setItem(key, value);
            }
        } catch (e) {
            console.error(`Failed to save item (${key}) to storage`);
        }
    }

    static async setNumber(key: string, value: number): Promise<void> {
        return this.setString(key, value.toString());
    }

    static async setObject(key: string, value: any): Promise<void> {
        return this.setString(key, JSON.stringify(value));
    }

}