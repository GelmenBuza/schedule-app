import {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {getRawScheduleData} from '@/services/scheduleService';
import {parseLessons} from "@/utils/parseLessons";
import {parseGroups} from "@/utils/parseGroups";
import {Picker} from "@react-native-picker/picker";
import {useRouter} from "expo-router";

export default function HomeScreen() {
    const [groups, setGroups] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Подставьте путь до конкретной группы, если на главной только список категорий
        // getRawScheduleData('/groups/301')
        getRawScheduleData('/groups')
            .then((result) => setGroups(parseGroups(result)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);


    const handleOpenSchedule = () => {
        if (!selectedGroup) {
            Alert.alert('Выберите группу', 'Сначала выберите группу в списке')
            return
        }

        router.push({
            pathname: '/schedule',
            params: {
                groupId: selectedGroup,
            }
        })
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
                <Text style={styles.statusText}>Загрузка групп...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Ошибка: {error}</Text>
            </View>
        );
    }
    // console.log('data', data)
    // console.log(parseLessons(data));
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/*<Text style={styles.code}>{JSON.stringify(data, null, 2)}</Text>*/}
            <Text>Выберите нужную группу</Text>
            <Picker
                selectedValue={selectedGroup}
                onValueChange={(group) => setSelectedGroup(group)}
            >
                {
                    groups ?
                        groups.map((group: Record<string, any>) => (
                            <Picker.Item label={group.name} value={group.id} key={group.id}/>
                        ))
                        :
                        <Text>Ошибка. Группы не загрузились</Text>
                }

            </Picker>
            <Pressable disabled={selectedGroup === null} onPress={handleOpenSchedule}>
                <Text>
                    Посмотреть расписание
                </Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
    content: {padding: 16},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16},
    statusText: {marginTop: 12, fontSize: 16},
    errorText: {color: '#d32f2f', fontSize: 16, textAlign: 'center'},
    code: {fontFamily: 'monospace', fontSize: 12},
});