// JWT keys.
// Online (demo): the keys are saved in the environment variables JWT_PRIVATE_KEY and JWT_PUBLIC_KEY.
// On your computer: the keys are read from the files in server/keys (created with "npm run keys").

const fs = require("fs")
const path = require("path")

const readKey = (envName, fileName) =>
{
    if(process.env[envName])
    {
        // hosting websites save new lines as "\n", so turn them back into real new lines
        return process.env[envName].replace(/\\n/g, "\n")
    }
    return fs.readFileSync(path.join(__dirname, "../keys", fileName), "utf8")
}

module.exports =
{
    PRIVATE_KEY: readKey("JWT_PRIVATE_KEY", "private.pem"),
    PUBLIC_KEY: readKey("JWT_PUBLIC_KEY", "public.pem")
}
