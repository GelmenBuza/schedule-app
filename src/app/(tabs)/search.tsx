import {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {getRawScheduleData} from '@/services/scheduleService';
import {parseGroups} from '@/utils/parseGroups';
import ScheduleView from '@/components/ScheduleView/ScheduleView';
import {Image} from 'expo-image'
import {parseTeachers} from "@/utils/parseTeachers";

type SearchType = 'groups' | 'teachers' | 'cabinets';

const SEARCH_TYPES: { id: SearchType; label: string }[] = [
    {id: 'groups', label: 'Группы'},
    {id: 'teachers', label: 'Преподаватели'},
    {id: 'cabinets', label: 'Кабинеты'},
];

export default function SearchScreen() {
    const [searchType, setSearchType] = useState<SearchType | null>(null);

    const [retryCount, setRetryCount] = useState(0);

    const [data, setData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedData, setSelectedData] = useState<string | number | null>(null);
    const [activeDataId, setActiveDataId] = useState<string | null>(null);

    useEffect(() => {
        if (!searchType || data !== null) return;

        const controller = new AbortController();

        setLoading(true);
        setError(null);

        getRawScheduleData(`/${searchType}`, controller.signal)
            .then((result) => {
                if (searchType !== 'teachers') {
                    setData(parseGroups(result))
                } else {
                    setData(parseTeachers(result))
                }
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                setError(err.message)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            });

        return () => {
            controller.abort();
        }
    }, [searchType, retryCount]);

    const handleOpenSchedule = () => {
        if (!selectedData) {
            Alert.alert(`Выберите ${searchType === 'groups' ? 'группу' : searchType === 'cabinets' ? 'кабинет' : 'преподавателя'}`,
                `Сначала выберите ${searchType === 'groups' ? 'группу' : searchType === 'cabinets' ? 'кабинет' : 'преподавателя'} из списка`);
            return;
        }
        setActiveDataId(String(selectedData));
    };

    // Если расписание уже открыто — показываем его с кнопкой возврата к поиску
    if (activeDataId) {
        const activeGroupName = data?.find((g) => String(g.id) === activeDataId)?.name || data?.find((g) => String(g.id) === activeDataId)?.fio;

        return (
            <View style={styles.scheduleWrapper}>
                <View style={styles.topBar}>
                    <View>
                        <Text
                            style={styles.topBarLabel}>{searchType === 'groups' ? 'Выбранная группа' : searchType === 'cabinets' ? 'Выбранный кабинет' : 'Выбранный преподаватель'}</Text>
                        <Text style={styles.topBarTitle}>{activeGroupName ?? activeDataId}</Text>
                    </View>
                    <Pressable
                        onPress={() => setActiveDataId(null)}
                        style={({pressed}) => [styles.backBtn, pressed && styles.backBtnPressed]}
                    >
                        <Text style={styles.backBtnText}>Изменить</Text>
                    </Pressable>
                </View>

                <ScheduleView endpoint={`/${searchType}/${activeDataId}`}/>
            </View>
        );
    }

    const isDisabled = selectedData === null;

    return (
        <View style={styles.container}>
            {/* Плашка выбора типа расписания */}
            <View style={styles.card}>
                <Text style={styles.title}>Расписание чего вы хотите посмотреть?</Text>
                <View style={styles.chipsRow}>
                    {SEARCH_TYPES.map((item) => {
                        const isSelected = searchType === item.id;
                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    if (searchType === item.id) return
                                    setSearchType(item.id)
                                    setData(null)
                                    setSelectedData(null)
                                }}
                                style={[styles.chip, isSelected && styles.chipActive]}
                            >
                                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* Блок выбора группы (показывается после выбора категории) */}
            {searchType && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Выбор {searchType === 'groups' ?
                        <Text>группы</Text> : searchType === 'cabinets' ? <Text>кабинета</Text> :
                            <Text>преподавателя</Text>}</Text>
                    <Text style={styles.subtitle}>Выберите {searchType === 'groups' ?
                        <Text>группу</Text> : searchType === 'cabinets' ? <Text>кабинет</Text> :
                            <Text>преподавателя</Text>} из списка</Text>

                    {loading ? (
                        <View style={styles.inlineCenter}>
                            <ActivityIndicator size="large" color="#3B82F6"/>
                            <Text style={styles.statusText}>Загрузка {searchType === 'groups' ?
                                <Text>групп</Text> : searchType === 'cabinets' ? <Text>кабинетов</Text> :
                                    <Text>преподавателей</Text>}...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorCard}>
                            <Image
                                source={require('../../assets/Bug.ico')}
                                style={styles.icon}
                                contentFit="contain"
                            />
                            <Text style={styles.errorTitle}>Не удалось загрузить</Text>
                            <Text style={styles.errorText}>{error}</Text>


                            <Pressable
                                onPress={() => setRetryCount((prev) => prev + 1)}
                                style={styles.retryBtn}
                            >
                                <Text style={styles.retryBtnText}>Повторить</Text>
                            </Pressable>
                        </View>
                    ) : data && data.length > 0 ? (
                        <>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={selectedData}
                                    onValueChange={(group) => setSelectedData(group)}
                                    style={styles.picker}
                                    dropdownIconColor="#3B82F6"
                                >
                                    <Picker.Item
                                        label={searchType === 'groups' ? '— Выберите группу —' : searchType === 'cabinets' ? '— Выберите кабинет —' : '— Выберите преподавателя —'}
                                        value={null}
                                        color="#9CA3AF"
                                    />
                                    {data.map((ell) => (
                                        <Picker.Item
                                            label={ell?.name || ell?.fio}
                                            value={ell.id}
                                            key={ell.id}
                                            color="#111827"
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <Pressable
                                disabled={isDisabled}
                                onPress={handleOpenSchedule}
                                style={({pressed}) => [
                                    styles.btn,
                                    isDisabled && styles.btnDisabled,
                                    pressed && !isDisabled && styles.btnPressed,
                                ]}
                            >
                                <Text style={[styles.btnText, isDisabled && styles.btnTextDisabled]}>
                                    Посмотреть расписание
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <Text style={styles.errorText}>Список групп пуст</Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        padding: 16,
        gap: 16,
    },
    scheduleWrapper: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    topBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    topBarLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    topBarTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    backBtn: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    backBtnPressed: {
        backgroundColor: '#DBEAFE',
    },
    backBtnText: {
        color: '#2563EB',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    cardTitle: {
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
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
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
    inlineCenter: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    pickerWrapper: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
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
    retryBtnText: {},
    retryBtn: {},
    icon: {
        width: 20,
        height: 20,
    },
});