/**
 * supported irc modes ie admin vocie etc
 * @depends [config]
 * @provides [config/modes]
 */
config.modes = [ //sort by importance
    {
        prefix: "@", //prefix
        "class": "op", //css class
        description: lang.getter("op")
    },
    {
        voice: "+",
        "class": "voice",
        description: lang.getter("voice")
    }
];