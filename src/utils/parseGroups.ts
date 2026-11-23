export const parseGroups = (data: Record<string, any> | null) => {
    if (!data || typeof data !== 'object') {
        return [];
    }

    const groupsBlock = Object.values(data).flat()
    if (!groupsBlock) {
        return [];
    }

    return groupsBlock.map((group: any) => ({
        id: group.id,
        name: group.name,
    }));
};