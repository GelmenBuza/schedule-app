import {parseGroups} from "@/utils/parseGroups";
import {parseTeachers} from "@/utils/parseTeachers";

interface SearchConfigItem {
    label: string;
    selectedLabel: string;
    title: string;
    accusative: string; // кого/что (выберите ...)
    plural: string;     // кого/чего (загрузка / список ...)
    parser: (data: any) => any[];
}

export type SearchType = 'groups' | 'teachers' | 'cabinets';

export const SEARCH_CONFIG: Record<SearchType, SearchConfigItem> = {
    groups: {
        label: 'Группы',
        selectedLabel: 'Выбранная группа',
        title: 'Выбор группы',
        accusative: 'группу',
        plural: 'групп',
        parser: parseGroups,
    },
    teachers: {
        label: 'Преподаватели',
        selectedLabel: 'Выбранный преподаватель',
        title: 'Выбор преподавателя',
        accusative: 'преподавателя',
        plural: 'преподавателей',
        parser: parseTeachers,
    },
    cabinets: {
        label: 'Кабинеты',
        selectedLabel: 'Выбранный кабинет',
        title: 'Выбор кабинета',
        accusative: 'кабинет',
        plural: 'кабинетов',
        parser: parseGroups,
    },
};


export const SEARCH_TYPES = Object.keys(SEARCH_CONFIG) as SearchType[];
