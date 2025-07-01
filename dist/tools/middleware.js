"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiAuth = apiAuth;
const apiKey = process.env.API_KEY;
function apiAuth(req, res, next) {
    const requestKey = req.headers['x-api-key'];
    if (apiKey !== requestKey) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}
//# sourceMappingURL=middleware.js.map