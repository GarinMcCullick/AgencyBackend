"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var user_1 = __importDefault(require("./user"));
var DiscordStrategy = require('passport-discord').Strategy;
dotenv_1.default.config();
var app = (0, express_1.default)();
mongoose_1.default.connect("" + process.env.START_MONGODB + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + process.env.END_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function () {
    console.log('Connected to mongoose successfully');
});
//MiddleWare
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use((0, express_session_1.default)({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
passport_1.default.serializeUser(function (user, done) {
    return done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    return done(null, user);
});
var scopes = ['identify', 'email', 'guilds', 'guilds.join'];
passport_1.default.use(new DiscordStrategy({
    clientID: '899137884823625728',
    clientSecret: 'eGs_ip7c8DwIjk3ipKg6_y2eqzLYRl-z',
    callbackURL: '/auth/discord/callback',
    scope: scopes
}, function (accessToken, refreshToken, profile, cb) {
    var _this = this;
    user_1.default.findOne({ discordId: profile.id }, function (err, doc) { return __awaiter(_this, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (err) {
                        return [2 /*return*/, cb(err, null)];
                    }
                    if (!!doc) return [3 /*break*/, 2];
                    newUser = new user_1.default({
                        discordId: profile.data.id,
                        username: profile.data.username
                    });
                    return [4 /*yield*/, newUser.save()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    cb(null, profile);
}));
app.get('/auth/discord', passport_1.default.authenticate('discord', { scope: ['identify'] })); //calls it
app.get('/auth/discord/callback', passport_1.default.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('http://localhost:3000'); // Successful auth
});
app.get('/', function (req, res) {
    res.send('hello world');
});
app.get('/getuser', function (req, res) {
    res.send(req.user);
});
app.listen(4000, function () {
    console.log('Server Started');
});
//# sourceMappingURL=index.js.map