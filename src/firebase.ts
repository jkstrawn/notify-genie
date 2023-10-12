import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export default class Firebase {

    static messaging: FirebaseMessagingTypes.Module | undefined;


    private static createMessaging(): FirebaseMessagingTypes.Module | undefined {
        if (this.messaging) return this.messaging;

        try {
            this.messaging = messaging();

            return this.messaging;
        } catch (error) {
            console.error(`Error creating firebase messaging: ${error}`);

            return undefined;
        }
    }

    static async getToken(): Promise<string | undefined> {
        const firebaseMessaging = this.createMessaging();
        if (!firebaseMessaging) return undefined;
        
        const enabled = await firebaseMessaging.hasPermission();
        if (enabled) {
            console.log('User already has fcm permission - generating token...');

            return await firebaseMessaging.getToken();
        } else {
            console.log("User doesn't have fcm permission - requesting permission");

            return firebaseMessaging.requestPermission()
                .then(async () => {
                    console.log('User has authorised fcm - generating token...');
                    return await firebaseMessaging.getToken();
                })
                .catch(error => {
                    console.log(`User has rejected fcm permissions, error = ${error}`)
                    return undefined;
                })
        }
    }
}