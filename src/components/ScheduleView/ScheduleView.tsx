import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getRawScheduleData } from '@/services/scheduleService';
import { DaySchedule, parseLessons } from '@/utils/parseLessons';
import LessonCard from '@/components/LesionCard/LessonCard';

interface ScheduleViewProps {
    endpoint: string;
}

export default function ScheduleView({ endpoint }: ScheduleViewProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lessons, setLessons] = useState<DaySchedule[]>([]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getRawScheduleData(endpoint)
            .then((result) => setLessons(parseLessons(result)))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [endpoint]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.statusText}>Загрузка расписания...</Text>
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

    if (lessons.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.statusText}>Занятий не найдено</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {lessons.map((day) => (
                <View key={day.date} style={styles.dayContainer}>
                    <View style={styles.dayHeader}>
                        <Text style={styles.weekdayText}>{day.weekdayName}</Text>
                        <Text style={styles.dateText}>{day.date}</Text>
                    </View>
                    {day.lessons.map((lesson) => (
                        <LessonCard lesson={lesson} key={lesson.id} />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F3F4F6',
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
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 32,
        gap: 24,
    },
    dayContainer: {
        gap: 10,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 2,
    },
    weekdayText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    dateText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
});