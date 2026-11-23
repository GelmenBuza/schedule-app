import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { getUserData, updateUserData, UserData } from '@/helpers/userDataStorage';
import { getRawScheduleData } from '@/services/scheduleService';
import { SEARCH_CONFIG, SEARCH_TYPES, SearchType } from '@/constants/config';

export default function SettingsScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState<UserData>({ type: null, id: null, name: null });

    const [selectedType, setSelectedType] = useState<SearchType | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const config = selectedType ? SEARCH_CONFIG[selectedType] : null;
    const savedConfig = saved.type ? SEARCH_CONFIG[saved.type as SearchType] : null;

    useEffect(() => {
        const loadData = async () => {
            const userData = await getUserData();
            setSaved(userData);
        };
        loadData();
    }, []);

    const loadList = async (type: SearchType) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getRawScheduleData(`/${type}`);
            setData(SEARCH_CONFIG[type].parser(result));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = () => {
        setIsEditing(true);
        setSelectedId(saved.id);

        if (saved.type) {
            const type = saved.type as SearchType;
            setSelectedType(type);
            loadList(type);
        } else {
            setSelectedType(null);
            setData(null);
        }
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setError(null);
    };

    const saveEditing = async () => {
        if (!selectedType || !selectedId) return;

        const selectedItem = data?.find((item) => item.id === selectedId);
        const itemName = selectedItem?.name || selectedItem?.fio || String(selectedId);

        const updated = await updateUserData({
            type: selectedType,
            id: selectedId,
            name: itemName,
        });

        setSaved(updated);
        setIsEditing(false);
    };

    const handleSelectType = (type: SearchType) => {
        if (selectedType === type) return;

        setSelectedType(type);
        setSelectedId(null);
        setData(null);
        loadList(type);
    };

    const isSaveDisabled = !selectedType || !selectedId || loading;

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Расписание по умолчанию</Text>
                <Text style={styles.subtitle}>
                    Будет автоматически открываться на главном экране
                </Text>

                {isEditing ? (
                    <View>
                        <View style={styles.chipsRow}>
                            {SEARCH_TYPES.map((type) => {
                                const isSelected = selectedType === type;
                                return (
                                    <Pressable
                                        key={type}
                                        onPress={() => handleSelectType(type)}
                                        style={[styles.chip, isSelected && styles.chipActive]}
                                    >
                                        <Text
                                            style={[
                                                styles.chipText,
                                                isSelected && styles.chipTextActive,
                                            ]}
                                        >
                                            {SEARCH_CONFIG[type].label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {config && (
                            <View style={styles.pickerSection}>
                                {loading ? (
                                    <View style={styles.inlineCenter}>
                                        <ActivityIndicator size="large" color="#3B82F6" />
                                        <Text style={styles.statusText}>
                                            Загрузка {config.plural}...
                                        </Text>
                                    </View>
                                ) : error ? (
                                    <View style={styles.errorCard}>
                                        <Text style={styles.errorTitle}>Не удалось загрузить</Text>
                                        <Text style={styles.errorText}>{error}</Text>
                                        <Pressable
                                            onPress={() => selectedType && loadList(selectedType)}
                                            style={({ pressed }) => [
                                                styles.retryBtn,
                                                pressed && styles.retryBtnPressed,
                                            ]}
                                        >
                                            <Text style={styles.retryBtnText}>Повторить</Text>
                                        </Pressable>
                                    </View>
                                ) : data && data.length > 0 ? (
                                    <View style={styles.pickerWrapper}>
                                        <Picker
                                            selectedValue={selectedId}
                                            onValueChange={(val) => setSelectedId(val)}
                                            style={styles.picker}
                                            dropdownIconColor="#3B82F6"
                                        >
                                            <Picker.Item
                                                label={`— Выберите ${config.accusative} —`}
                                                value={null}
                                                color="#9CA3AF"
                                            />
                                            {data.map((item) => (
                                                <Picker.Item
                                                    label={item.name || item.fio}
                                                    value={item.id}
                                                    key={item.id}
                                                    color="#111827"
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                ) : (
                                    <Text style={styles.errorText}>
                                        Список {config.plural} пуст
                                    </Text>
                                )}
                            </View>
                        )}

                        <View style={styles.actionsRow}>
                            <Pressable
                                onPress={cancelEditing}
                                style={({ pressed }) => [
                                    styles.btn,
                                    styles.cancelBtn,
                                    pressed && styles.cancelBtnPressed,
                                ]}
                            >
                                <Text style={styles.cancelBtnText}>Отмена</Text>
                            </Pressable>

                            <Pressable
                                disabled={isSaveDisabled}
                                onPress={saveEditing}
                                style={({ pressed }) => [
                                    styles.btn,
                                    styles.saveBtn,
                                    isSaveDisabled && styles.btnDisabled,
                                    pressed && !isSaveDisabled && styles.btnPressed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.btnText,
                                        isSaveDisabled && styles.btnTextDisabled,
                                    ]}
                                >
                                    Сохранить
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View>
                        {savedConfig && saved.name ? (
                            <View style={styles.savedBox}>
                                <Text style={styles.savedLabel}>{savedConfig.selectedLabel}</Text>
                                <Text style={styles.savedValue}>{saved.name}</Text>
                            </View>
                        ) : (
                            <View style={styles.savedBox}>
                                <Text style={styles.emptyText}>Ничего не выбрано</Text>
                            </View>
                        )}

                        <Pressable
                            onPress={startEditing}
                            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
                        >
                            <Text style={styles.btnText}>
                                {saved.id ? 'Изменить' : 'Выбрать'}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>

            <Text style={styles.footer}>By: Gelmen_</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 16,
        justifyContent: 'space-between',
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    savedBox: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
    },
    savedLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    savedValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    emptyText: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },
    chipText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    chipTextActive: {
        color: '#2563EB',
    },
    pickerSection: {
        marginBottom: 16,
    },
    pickerWrapper: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        color: '#111827',
    },
    inlineCenter: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    statusText: {
        marginTop: 12,
        fontSize: 15,
        color: '#6B7280',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    btn: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtn: {
        flex: 1,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cancelBtnPressed: {
        backgroundColor: '#E5E7EB',
    },
    cancelBtnText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
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
    errorCard: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    errorTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#991B1B',
        marginBottom: 4,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 14,
        backgroundColor: '#DC2626',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    retryBtnPressed: {
        backgroundColor: '#B91C1C',
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        textAlign: 'center',
        fontSize: 13,
        color: '#9CA3AF',
        paddingBottom: 4,
    },
});