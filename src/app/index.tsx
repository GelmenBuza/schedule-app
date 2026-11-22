import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { getRawScheduleData } from '@/services/scheduleService';
import { parseGroups } from '@/utils/parseGroups';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [groups, setGroups] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string | number | null>(null);
    const router = useRouter();

    useEffect(() => {
        getRawScheduleData('/groups')
            .then((result) => setGroups(parseGroups(result)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleOpenSchedule = () => {
        if (!selectedGroup) {
            Alert.alert('Выберите группу', 'Сначала выберите группу в списке');
            return;
        }

        router.push({
            pathname: '/schedule',
            params: {
                groupId: String(selectedGroup),
            },
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.statusText}>Загрузка групп...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <View style={styles.errorCard}>
                    <Text style={styles.errorTitle}>Не удалось загрузить</Text>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    const isDisabled = selectedGroup === null;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Расписание занятий</Text>
                <Text style={styles.subtitle}>Выберите вашу учебную группу из списка</Text>

                {groups && groups.length > 0 ? (
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedGroup}
                            onValueChange={(group) => setSelectedGroup(group)}
                            style={styles.picker}
                            dropdownIconColor="#3B82F6"
                        >
                            <Picker.Item
                                label="— Выберите группу —"
                                value={null}
                                color="#9CA3AF"
                            />
                            {groups.map((group) => (
                                <Picker.Item
                                    label={group.name}
                                    value={group.id}
                                    key={group.id}
                                    color="#111827"
                                />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <Text style={styles.errorText}>Список групп пуст</Text>
                )}

                <Pressable
                    disabled={isDisabled}
                    onPress={handleOpenSchedule}
                    style={({ pressed }) => [
                        styles.btn,
                        isDisabled && styles.btnDisabled,
                        pressed && !isDisabled && styles.btnPressed,
                    ]}
                >
                    <Text style={[styles.btnText, isDisabled && styles.btnTextDisabled]}>
                        Посмотреть расписание
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        padding: 16,
    },
    center: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },
    pickerWrapper: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        color: '#111827',
    },
    btn: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnPressed: {
        backgroundColor: '#2563EB',
    },
    btnDisabled: {
        backgroundColor: '#E5E7EB',
    },
    btnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    btnTextDisabled: {
        color: '#9CA3AF',
    },
    statusText: {
        marginTop: 12,
        fontSize: 15,
        color: '#6B7280',
    },
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#991B1B',
        marginBottom: 6,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
    },
});