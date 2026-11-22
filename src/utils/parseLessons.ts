const WEEKDAYS: Record<number, string> = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье',
}

export interface ParsedLessons {
    id: number;
    data: string;
    weekday: number;
    lessonNumber: number;
    startTime: string;
    endTime: string;
    subject: string;
    typeLesson: string | null;
    cabinet: string | null;
    teachers: string[];
}

export interface DaySchedule {
    date: string;
    weekday: number;
    weekdayName: string;
    lessons: ParsedLessons[];
}

export const parseLessons = (data: Record<string, any> | null): DaySchedule[] => {
    if (!data || typeof data !== 'object') {
        return [];
    }
    const scheduleBlock = Object.values(data).find((item) =>
        Array.isArray(item?.lessons)
    );

    if (!scheduleBlock) {
        return [];
    }

    const groupedByDate = new Map<string, DaySchedule>();

    for (const lesson of scheduleBlock.lessons) {
        const parsedLessons: ParsedLessons = {
            id: lesson.id,
            data: lesson.data,
            weekday: lesson.weekday,
            lessonNumber: lesson.lessonNumber,
            startTime: lesson.startTime,
            endTime: lesson.endTime,
            subject: lesson.subject?.name ?? 'Без названия',
            typeLesson: lesson.typeLesson?.name ?? null,
            cabinet: lesson.cabinet?.name ?? null,
            teachers: Array.isArray(lesson.teachers) ?
                lesson.teachers.map((t: any) => t.fio) :
                [],
        }

        if (!groupedByDate.has(lesson.date)) {
            groupedByDate.set(lesson.date, {
                date: lesson.date,
                weekday: lesson.weekday,
                weekdayName: WEEKDAYS[lesson.weekday] ?? '',
                lessons: [],
            })
        }

        groupedByDate.get(lesson.date)!.lessons.push(parsedLessons);
    }

    return Array.from(groupedByDate.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((day) => ({
            ...day,
            lessons: day.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber),
        }))

}