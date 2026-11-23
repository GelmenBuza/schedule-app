export const parseTeachers = (data: Record<string, any> | null) => {
    if (!data || typeof data !== 'object') {
        return [];
    }

    const teachersBlock = Object.values(data).flat()
    if (!teachersBlock) {
        return [];
    }

    return teachersBlock.map((teacher: any) => ({
        id: teacher.id,
        fio: teacher.fio,
    }));
};