import {ParsedLessons} from "@/utils/parseLessons";
import {View, Text, StyleSheet} from "react-native";


export default function LessonCard({lesson}: { lesson: ParsedLessons }) {

    return (
        <View style={styles.container}>
            <View style={styles.time}>
                <Text style={styles.startTime}>{lesson.startTime}</Text>
                <Text style={styles.endTime}>{lesson.endTime}</Text>
            </View>

            <View style={styles.divider}/>

            <View style={styles.content}>
                <Text style={styles.subject}>{lesson.subject}</Text>

                {lesson.teachers.length > 0 && (
                    <View style={styles.teachersContainer}>
                        {lesson.teachers.map((fio) => (
                            <Text key={fio} style={styles.teacherText}>
                                {fio}
                            </Text>
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    {lesson.cabinet ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Каб. {lesson.cabinet}</Text>
                        </View>
                    ) : (
                        <View style={[styles.badge, styles.asyncBadge]}>
                            <Text style={[styles.badgeText, styles.asyncBadgeText]}>
                                {lesson.typeLesson ?? 'Асинхрон'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    time: {
        width: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startTime: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    endTime: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
        marginTop: 2,
    },
    divider: {
        width: 3,
        backgroundColor: '#3B82F6',
        borderRadius: 2,
        marginHorizontal: 12,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        gap: 6,
    },
    subject: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        lineHeight: 21,
    },
    teachersContainer: {
        gap: 2,
    },
    teacherText: {
        fontSize: 13,
        color: '#6B7280',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 2,
    },
    badge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2563EB',
    },
    asyncBadge: {
        backgroundColor: '#FEF3C7',
    },
    asyncBadgeText: {
        color: '#D97706',
    },
});