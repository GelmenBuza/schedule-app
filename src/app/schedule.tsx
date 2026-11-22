import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {getRawScheduleData} from "@/services/scheduleService";
import {parseGroups} from "@/utils/parseGroups";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {parseLessons} from "@/utils/parseLessons";


export default function scheduleScreen() {
    const {groupId} = useLocalSearchParams<{ groupId: string }>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        getRawScheduleData(`/groups/${groupId}`)
            .then((result) => setLessons(parseLessons(result)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);


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

    return (
        <View >

        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
    content: {padding: 16},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16},
    statusText: {marginTop: 12, fontSize: 16},
    errorText: {color: '#d32f2f', fontSize: 16, textAlign: 'center'},
    code: {fontFamily: 'monospace', fontSize: 12},
});