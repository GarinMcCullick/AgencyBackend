import express from 'express'
import  mongoose from 'mongoose';
import dotenv from "dotenv"
import cors from 'cors'
import session from 'express-session'
import passport, { serializeUser } from 'passport'
import user from './user';
import { IMongoDBUser } from './types';
const DiscordStrategy = require('passport-discord').Strategy;

dotenv.config();

const app = express();

mongoose.connect(`${process.env.START_MONGODB}${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}${process.env.END_MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology:true
}, ()=> {
    console.log('Connected to mongoose successfully')
})

//MiddleWare
app.use(express.json());
app.use(cors({ origin:"http://localhost:3000", credentials: true })) //front end url

app.set("trust proxy", 1);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 //one week
    }
  }))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: IMongoDBUser, done:any) => {
   return done(null, user._id); //only serializes the id (best practice)
})

passport.deserializeUser((id: string, done:any) => {

    user.findById(id, (err: Error, doc: IMongoDBUser) => {
        return done(null, doc) //finds user in database
    })

})

const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.use(new DiscordStrategy({
    clientID: '899137884823625728',
    clientSecret: 'eGs_ip7c8DwIjk3ipKg6_y2eqzLYRl-z',
    callbackURL: '/auth/discord/callback',
    scope: scopes
},
function(_: any, __: any, profile: any, cb: any) {
    
    user.findOne({ discordId: profile.id }, async (err: Error, doc: IMongoDBUser) => {
        if (err){
            return cb(err, null);
        }
        if(!doc) {
            //create a user
            const newUser = new user({
                discordId: profile.id,
                username: profile.username
            });
            await newUser.save();
            cb(null, newUser);
        }
        cb(null, doc)
    })
    
}));

app.get('/auth/discord', passport.authenticate('discord', {scope: ['identify']})); //calls it

app.get('/auth/discord/callback', passport.authenticate('discord', { //failure to auth
    failureRedirect: '/'
}), function(req, res) { 
    res.redirect('http://localhost:3000') // Successful auth front end url
});

app.get('/', (req,res) => {
    res.send('hello world');
})

app.get('/getuser', (req,res) => {
    res.send(req.user);
})

app.listen(process.env.PORT || 4000, ()=> {
    console.log('Server Started');
})