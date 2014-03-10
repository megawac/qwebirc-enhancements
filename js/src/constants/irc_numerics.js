/**
 * @depends [irc]
 * @provides [irc/Numerics]
 */
//https://www.alien.net.au/irc/irc2numerics.html
irc.Numerics = { // from node-irc
    "001": {
        "name": "RPL_WELCOME",
        "type": "reply"
    },
    "004": {
        "name": "RPL_MYINFO",
        "type": "reply"
    },
    "005": {
        "name": "RPL_ISUPPORT",
        "type": "reply"
    },
    "200": {
        "name": "RPL_TRACELINK",
        "type": "reply"
    },
    "201": {
        "name": "RPL_TRACECONNECTING",
        "type": "reply"
    },
    "202": {
        "name": "RPL_TRACEHANDSHAKE",
        "type": "reply"
    },
    "203": {
        "name": "RPL_TRACEUNKNOWN",
        "type": "reply"
    },
    "204": {
        "name": "RPL_TRACEOPERATOR",
        "type": "reply"
    },
    "205": {
        "name": "RPL_TRACEUSER",
        "type": "reply"
    },
    "206": {
        "name": "RPL_TRACESERVER",
        "type": "reply"
    },
    "208": {
        "name": "RPL_TRACENEWTYPE",
        "type": "reply"
    },
    "211": {
        "name": "RPL_STATSLINKINFO",
        "type": "reply"
    },
    "212": {
        "name": "RPL_STATSCOMMANDS",
        "type": "reply"
    },
    "213": {
        "name": "RPL_STATSCLINE",
        "type": "reply"
    },
    "214": {
        "name": "RPL_STATSNLINE",
        "type": "reply"
    },
    "215": {
        "name": "RPL_STATSILINE",
        "type": "reply"
    },
    "216": {
        "name": "RPL_STATSKLINE",
        "type": "reply"
    },
    "218": {
        "name": "RPL_STATSYLINE",
        "type": "reply"
    },
    "219": {
        "name": "RPL_ENDOFSTATS",
        "type": "reply"
    },
    "221": {
        "name": "RPL_UMODEIS",
        "type": "reply"
    },
    "241": {
        "name": "RPL_STATSLLINE",
        "type": "reply"
    },
    "242": {
        "name": "RPL_STATSUPTIME",
        "type": "reply"
    },
    "243": {
        "name": "RPL_STATSOLINE",
        "type": "reply"
    },
    "244": {
        "name": "RPL_STATSHLINE",
        "type": "reply"
    },
    "250": {
        "name": "RPL_STATSCONN",
        "type": "reply"
    },
    "251": {
        "name": "RPL_LUSERCLIENT",
        "type": "reply"
    },
    "252": {
        "name": "RPL_LUSEROP",
        "type": "reply"
    },
    "253": {
        "name": "RPL_LUSERUNKNOWN",
        "type": "reply"
    },
    "254": {
        "name": "RPL_LUSERCHANNELS",
        "type": "reply"
    },
    "255": {
        "name": "RPL_LUSERME",
        "type": "reply"
    },
    "256": {
        "name": "RPL_ADMINME",
        "type": "reply"
    },
    "257": {
        "name": "RPL_ADMINLOC1",
        "type": "reply"
    },
    "258": {
        "name": "RPL_ADMINLOC2",
        "type": "reply"
    },
    "259": {
        "name": "RPL_ADMINEMAIL",
        "type": "reply"
    },
    "261": {
        "name": "RPL_TRACELOG",
        "type": "reply"
    },
    "265": {
        "name": "RPL_LOCALUSERS",
        "type": "reply"
    },
    "266": {
        "name": "RPL_GLOBALUSERS",
        "type": "reply"
    },
    "300": {
        "name": "RPL_NONE",
        "type": "reply"
    },
    "301": {
        "name": "RPL_AWAY",
        "type": "reply"
    },
    "302": {
        "name": "RPL_USERHOST",
        "type": "reply"
    },
    "303": {
        "name": "RPL_ISON",
        "type": "reply"
    },
    "305": {
        "name": "RPL_UNAWAY",
        "type": "reply"
    },
    "306": {
        "name": "RPL_NOWAWAY",
        "type": "reply"
    },
    "311": {
        "name": "RPL_WHOISUSER",
        "type": "reply"
    },
    "312": {
        "name": "RPL_WHOISSERVER",
        "type": "reply"
    },
    "313": {
        "name": "RPL_WHOISOPERATOR",
        "type": "reply"
    },
    "314": {
        "name": "RPL_WHOWASUSER",
        "type": "reply"
    },
    "315": {
        "name": "RPL_ENDOFWHO",
        "type": "reply"
    },
    "317": {
        "name": "RPL_WHOISIDLE",
        "type": "reply"
    },
    "318": {
        "name": "RPL_ENDOFWHOIS",
        "type": "reply"
    },
    "319": {
        "name": "RPL_WHOISCHANNELS",
        "type": "reply"
    },

    "320": {
        "name": "RPL_WHOISGENERICTEXT",
        "type": "reply"
    },
    "325": {
        "name": "RPL_WHOISWEBIRC",
        "type": "reply"
    },
    "330": {
        "name": "RPL_WHOISACCOUNT",
        "type": "reply"
    },
    "338": {
        "name": "RPL_WHOISACTUALLY",
        "type": "reply"
    },
    "343": {
        "name": "RPL_WHOISOPERNAME",
        "type": "reply"
    },
    "321": {
        "name": "RPL_LISTSTART",
        "type": "reply"
    },
    "322": {
        "name": "RPL_LIST",
        "type": "reply"
    },
    "323": {
        "name": "RPL_LISTEND",
        "type": "reply"
    },
    "324": {
        "name": "RPL_CHANNELMODEIS",
        "type": "reply"
    },
    "329": {
        "name": "RPL_CREATIONTIME",
        "type": "reply"
    },
    "331": {
        "name": "RPL_NOTOPIC",
        "type": "reply"
    },
    "332": {
        "name": "RPL_TOPIC",
        "type": "reply"
    },
    "333": {
        "name": "RPL_TOPICWHOTIME",
        "type": "reply"
    },
    "341": {
        "name": "RPL_INVITING",
        "type": "reply"
    },
    "342": {
        "name": "RPL_SUMMONING",
        "type": "reply"
    },
    "351": {
        "name": "RPL_VERSION",
        "type": "reply"
    },
    "352": {
        "name": "RPL_WHOREPLY",
        "type": "reply"
    },
    "353": {
        "name": "RPL_NAMREPLY",
        "type": "reply"
    },
    "364": {
        "name": "RPL_LINKS",
        "type": "reply"
    },
    "365": {
        "name": "RPL_ENDOFLINKS",
        "type": "reply"
    },
    "366": {
        "name": "RPL_ENDOFNAMES",
        "type": "reply"
    },
    "367": {
        "name": "RPL_BANLIST",
        "type": "reply"
    },
    "368": {
        "name": "RPL_ENDOFBANLIST",
        "type": "reply"
    },
    "369": {
        "name": "RPL_ENDOFWHOWAS",
        "type": "reply"
    },
    "371": {
        "name": "RPL_INFO",
        "type": "reply"
    },
    "372": {
        "name": "RPL_MOTD",
        "type": "reply"
    },
    "374": {
        "name": "RPL_ENDOFINFO",
        "type": "reply"
    },
    "375": {
        "name": "RPL_MOTDSTART",
        "type": "reply"
    },
    "376": {
        "name": "RPL_ENDOFMOTD",
        "type": "reply"
    },
    "381": {
        "name": "RPL_YOUREOPER",
        "type": "reply"
    },
    "382": {
        "name": "RPL_REHASHING",
        "type": "reply"
    },
    "391": {
        "name": "RPL_TIME",
        "type": "reply"
    },
    "392": {
        "name": "RPL_USERSSTART",
        "type": "reply"
    },
    "393": {
        "name": "RPL_USERS",
        "type": "reply"
    },
    "394": {
        "name": "RPL_ENDOFUSERS",
        "type": "reply"
    },
    "395": {
        "name": "RPL_NOUSERS",
        "type": "reply"
    },
    "401": {
        "name": "ERR_NOSUCHNICK",
        "type": "error"
    },
    "402": {
        "name": "ERR_NOSUCHSERVER",
        "type": "error"
    },
    "403": {
        "name": "ERR_NOSUCHCHANNEL",
        "type": "error"
    },
    "404": {
        "name": "ERR_CANNOTSENDTOCHAN",
        "type": "error"
    },
    "405": {
        "name": "ERR_TOOMANYCHANNELS",
        "type": "error"
    },
    "406": {
        "name": "ERR_WASNOSUCHNICK",
        "type": "error"
    },
    "407": {
        "name": "ERR_TOOMANYTARGETS",
        "type": "error"
    },
    "409": {
        "name": "ERR_NOORIGIN",
        "type": "error"
    },
    "411": {
        "name": "ERR_NORECIPIENT",
        "type": "error"
    },
    "412": {
        "name": "ERR_NOTEXTTOSEND",
        "type": "error"
    },
    "413": {
        "name": "ERR_NOTOPLEVEL",
        "type": "error"
    },
    "414": {
        "name": "ERR_WILDTOPLEVEL",
        "type": "error"
    },
    "421": {
        "name": "ERR_UNKNOWNCOMMAND",
        "type": "error"
    },
    "422": {
        "name": "ERR_NOMOTD",
        "type": "error"
    },
    "423": {
        "name": "ERR_NOADMININFO",
        "type": "error"
    },
    "424": {
        "name": "ERR_FILEERROR",
        "type": "error"
    },
    "431": {
        "name": "ERR_NONICKNAMEGIVEN",
        "type": "error"
    },
    "432": {
        "name": "ERR_ERRONEUSNICKNAME",
        "type": "error"
    },
    "433": {
        "name": "ERR_NICKNAMEINUSE",
        "type": "error"
    },
    "436": {
        "name": "ERR_NICKCOLLISION",
        "type": "error"
    },
    "441": {
        "name": "ERR_USERNOTINCHANNEL",
        "type": "error"
    },
    "442": {
        "name": "ERR_NOTONCHANNEL",
        "type": "error"
    },
    "443": {
        "name": "ERR_USERONCHANNEL",
        "type": "error"
    },
    "444": {
        "name": "ERR_NOLOGIN",
        "type": "error"
    },
    "445": {
        "name": "ERR_SUMMONDISABLED",
        "type": "error"
    },
    "446": {
        "name": "ERR_USERSDISABLED",
        "type": "error"
    },
    "451": {
        "name": "ERR_NOTREGISTERED",
        "type": "error"
    },
    "461": {
        "name": "ERR_NEEDMOREPARAMS",
        "type": "error"
    },
    "462": {
        "name": "ERR_ALREADYREGISTRED",
        "type": "error"
    },
    "463": {
        "name": "ERR_NOPERMFORHOST",
        "type": "error"
    },
    "464": {
        "name": "ERR_PASSWDMISMATCH",
        "type": "error"
    },
    "465": {
        "name": "ERR_YOUREBANNEDCREEP",
        "type": "error"
    },
    "467": {
        "name": "ERR_KEYSET",
        "type": "error"
    },
    "471": {
        "name": "ERR_CHANNELISFULL",
        "type": "error"
    },
    "472": {
        "name": "ERR_UNKNOWNMODE",
        "type": "error"
    },
    "473": {
        "name": "ERR_INVITEONLYCHAN",
        "type": "error"
    },
    "474": {
        "name": "ERR_BANNEDFROMCHAN",
        "type": "error"
    },
    "475": {
        "name": "ERR_BADCHANNELKEY",
        "type": "error"
    },
    "481": {
        "name": "ERR_NOPRIVILEGES",
        "type": "error"
    },
    "482": {
        "name": "ERR_CHANOPPRIVSNEEDED",
        "type": "error"
    },
    "483": {
        "name": "ERR_CANTKILLSERVER",
        "type": "error"
    },
    "491": {
        "name": "ERR_NOOPERHOST",
        "type": "error"
    },
    "501": {
        "name": "ERR_UMODEUNKNOWNFLAG",
        "type": "error"
    },
    "502": {
        "name": "ERR_USERSDONTMATCH",
        "type": "error"
    }
};