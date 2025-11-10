export const buildSortQuery = (sort: string, allowedFields: string[]) => {
    const field = sort.startsWith("-") ? sort.substring(1) : sort;
    const direction = sort.startsWith("-") ? -1 : 1;

    if (!allowedFields.includes(field)) {
        return { createdAt: -1 }; // default fallback
    }

    return { [field]: direction };
};
