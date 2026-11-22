export const parseLessons = (data: Record<string, any> | null) => {
    if (!data || typeof data !== 'object') {
        return [];
    }
    console.log(JSON.stringify(data, null, 2))
    // Ищем первый блок данных, в котором есть массив lessons
    const scheduleBlock = Object.values(data).find((item) =>
        Array.isArray(item?.lessons)
    );

    if (!scheduleBlock) {
        return [];
    }

    return scheduleBlock.lessons.map((lesson: any) => ({
        id: lesson.id,
        date: lesson.date,
        weekday: lesson.weekday,
        lessonNumber: lesson.lessonNumber,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        subject: lesson.subject,
        typeLesson: lesson.typeLesson?.name ?? null,
        cabinet: lesson.cabinet,
        teachers: lesson.teachers ?? [],
    }));
};