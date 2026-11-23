import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback, useState } from 'react';
import { getUserData, UserData } from '@/helpers/userDataStorage';
import ScheduleView from '@/components/ScheduleView/ScheduleView';
import { useRouter, useFocusEffect } from 'expo-router';

export default function HomeScreen() {
    const [saved, setSaved] = useState<UserData>({ type: null, id: null, name: null });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const userData = await getUserData();
                setSaved(userData);
                setLoading(false);
            };
            loadData();
        }, [])
    );

    const dataIsOk = Boolean(saved.type && saved.id);

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.statusText}>Загрузка данных...</Text>
                </View>
            ) : dataIsOk ? (
                <ScheduleView endpoint={`/${saved.type}/${saved.id}`} />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Расписание не выбрано</Text>
                        <Text style={styles.subtitle}>
                            Стандартные данные ещё не заданы. Вы можете выбрать расписание по умолчанию или найти его вручную.
                        </Text>

                        <View style={styles.buttonsContainer}>
                            <Pressable
                                onPress={() => router.navigate('/settings')}
                                style={({ pressed }) => [
                                    styles.btn,
                                    pressed && styles.btnPressed,
                                ]}
                            >
                                <Text style={styles.btnText}>Установить стандартные значения</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => router.navigate('/search')}
                                style={({ pressed }) => [
                                    styles.btn,
                                    styles.secondaryBtn,
                                    pressed && styles.secondaryBtnPressed,
                                ]}
                            >
                                <Text style={styles.secondaryBtnText}>Использовать поиск</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    statusText: {
        marginTop: 12,
        fontSize: 15,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    buttonsContainer: {
        gap: 10,
    },
    btn: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    btnPressed: {
        backgroundColor: '#2563EB',
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    secondaryBtn: {
        backgroundColor: '#EFF6FF',
    },
    secondaryBtnPressed: {
        backgroundColor: '#DBEAFE',
    },
    secondaryBtnText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '600',
    },
});