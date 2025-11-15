"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSortQuery = void 0;
const buildSortQuery = (sort, allowedFields) => {
    const field = sort.startsWith("-") ? sort.substring(1) : sort;
    const direction = sort.startsWith("-") ? -1 : 1;
    if (!allowedFields.includes(field)) {
        return { createdAt: -1 }; // default fallback
    }
    return { [field]: direction };
};
exports.buildSortQuery = buildSortQuery;
