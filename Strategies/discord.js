const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const User = require("../schema/Users");
//
passport.serializeUser((user, done) => {
  done(null, user.discordID);
});

passport.deserializeUser(async (discordID, done) => {
  try {
    const user = await User.findOne({ discordID });
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    console.log(error);
    done(err, null);
  }
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID_SITE,
      clientSecret: process.env.TOKEN_SITE,
      callbackURL: process.env.CALLBACK_URL_SITE,
      scope: ["identify", "guilds"],
    },
    async (accessToken, refershToken, profile, done) => {
      const { id, username, discriminator, avatar, guilds } = profile;
      console.log(id, username, discriminator, avatar, guilds);
      try {
        const findUser = await User.findOne({ discordID: id });
        if (findUser) {
          console.log("user is found");
          return done(null, findUser);
        } else {
          const newUser = await User.create({
            discordID: id,
            discordTag: `${username}#${discriminator}`,
            avatar,
            guilds,
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
