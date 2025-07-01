"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cocktail_1 = __importDefault(require("./routes/cocktail"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const preferences_1 = __importDefault(require("./routes/preferences"));
const recommendations_1 = __importDefault(require("./routes/recommendations"));
const favorites_1 = __importDefault(require("./routes/favorites"));
const router = express_1.default.Router();
router.use('/cocktails', cocktail_1.default);
router.use('/auth', auth_1.default);
router.use('/recommendations', recommendations_1.default);
router.use('/user', user_1.default);
router.use('/preferences', preferences_1.default);
router.use('/favorites', favorites_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map