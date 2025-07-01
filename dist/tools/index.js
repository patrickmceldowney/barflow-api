"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = createSlug;
function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/[\s&.,'()]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
//# sourceMappingURL=index.js.map