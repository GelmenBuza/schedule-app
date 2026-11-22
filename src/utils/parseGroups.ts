export const parseGroups = (data: Record<string, any> | null) => {
    if (!data || typeof data !== 'object') {
        return [];
    }

    // Ищем первый блок данных, в котором есть массив lessons
    const scheduleBlock = Object.values(data).flat()
    if (!scheduleBlock) {
        return [];
    }

    return scheduleBlock.map((group: any) => ({
        id: group.id,
        name: group.name,
    }));
};