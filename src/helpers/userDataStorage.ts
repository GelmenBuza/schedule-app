import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'userDataStorage';

export interface UserData {
    type: string | null;
    id: number | null;
    name: string | null;
}

export async function getUserData(): Promise<UserData> {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return {type: null, id: null, name: null};
        return JSON.parse(raw) as UserData;
    } catch (error) {
        console.error("Ошибка при чтении файлов данных: ", error);
        return {type: null, id: null, name: null};
    }
}

export async function updateUserData(partial: Partial<UserData>): Promise<UserData> {
    const current = await getUserData();
    const updated: UserData = {...current, ...partial};

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}