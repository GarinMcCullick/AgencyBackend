"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var user = new mongoose_1.default.Schema({
    discordId: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    guilds: {
        required: true,
        type: Array,
    },
    avatar: {
        required: true,
        type: String,
    },
});
exports.default = mongoose_1.default.model("User", user);
//# sourceMappingURL=user.js.map