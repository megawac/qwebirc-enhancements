ui.WINDOW_STATUS = 1;
ui.WINDOW_QUERY = 2;
ui.WINDOW_CHANNEL = 4;
ui.WINDOW_CUSTOM = 8;
ui.WINDOW_CONNECT = 16;
ui.WINDOW_MESSAGES = 32;
ui.CUSTOM_CLIENT = "custom";

ui.HILIGHT_NONE = 0;
ui.HILIGHT_ACTIVITY = 1;
ui.HILIGHT_SPEECH = 2;
ui.HILIGHT_US = 3;

ui.MAXIMUM_LINES_PER_WINDOW = 1000;
ui.WINDOW_LASTLINE = ui.WINDOW_QUERY | ui.WINDOW_MESSAGES | ui.WINDOW_CHANNEL | ui.WINDOW_STATUS;

irc.PMODE_LIST = 0;
irc.PMODE_SET_UNSET = 1;
irc.PMODE_SET_ONLY = 2;
irc.PMODE_REGULAR_MODE = 3;


var BROUHAHA = '#brouhaha',
    CONNECTION_DETAILS = 'Connection details',
    STATUS = 'Status',
    OPTIONS = 'Options',
    ACTIVE = '\x09ACTIVE',


    BASE_WINDOWS = [BROUHAHA, CONNECTION_DETAILS, STATUS],
    CHANNEL_TYPES = [ui.WINDOW_CHANNEL, ui.WINDOW_QUERY, ui.WINDOW_MESSAGES],
    INPUT_TYPES = [ui.WINDOW_STATUS, ui.WINDOW_QUERY, ui.WINDOW_CHANNEL, ui.WINDOW_MESSAGES];

var OPED = "+",
    DEOPED = "-",
    OPSTATUS = "@",
    VOICESTATUS = "+";

irc.IRCLowercaseTable = [ /* x00-x07 */ '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    /* x08-x0f */
    '\x08', '\x09', '\x0a', '\x0b', '\x0c', '\x0d', '\x0e', '\x0f',
    /* x10-x17 */
    '\x10', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17',
    /* x18-x1f */
    '\x18', '\x19', '\x1a', '\x1b', '\x1c', '\x1d', '\x1e', '\x1f',
    /* ' '-x27 */
    ' ', '!', '"', '#', '$', '%', '&', '\x27',
    /* '('-'/' */
    '(', ')', '*', '+', ',', '-', '.', '/',
    /* '0'-'7' */
    '0', '1', '2', '3', '4', '5', '6', '7',
    /* '8'-'?' */
    '8', '9', ':', ';', '<', '=', '>', '?',
    /* '@'-'G' */
    '@', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'H'-'O' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'P'-'W' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'X'-'_' */
    'x', 'y', 'z', '{', '|', '}', '~', '_',
    /* '`'-'g' */
    '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
    /* 'h'-'o' */
    'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    /* 'p'-'w' */
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
    /* 'x'-x7f */
    'x', 'y', 'z', '{', '|', '}', '~', '\x7f',
    /* x80-x87 */
    '\x80', '\x81', '\x82', '\x83', '\x84', '\x85', '\x86', '\x87',
    /* x88-x8f */
    '\x88', '\x89', '\x8a', '\x8b', '\x8c', '\x8d', '\x8e', '\x8f',
    /* x90-x97 */
    '\x90', '\x91', '\x92', '\x93', '\x94', '\x95', '\x96', '\x97',
    /* x98-x9f */
    '\x98', '\x99', '\x9a', '\x9b', '\x9c', '\x9d', '\x9e', '\x9f',
    /* xa0-xa7 */
    '\xa0', '\xa1', '\xa2', '\xa3', '\xa4', '\xa5', '\xa6', '\xa7',
    /* xa8-xaf */
    '\xa8', '\xa9', '\xaa', '\xab', '\xac', '\xad', '\xae', '\xaf',
    /* xb0-xb7 */
    '\xb0', '\xb1', '\xb2', '\xb3', '\xb4', '\xb5', '\xb6', '\xb7',
    /* xb8-xbf */
    '\xb8', '\xb9', '\xba', '\xbb', '\xbc', '\xbd', '\xbe', '\xbf',
    /* xc0-xc7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xc8-xcf */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xd0-xd7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xd7',
    /* xd8-xdf */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xdf',
    /* xe0-xe7 */
    '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7',
    /* xe8-xef */
    '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
    /* xf0-xf7 */
    '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf7',
    /* xf8-xff */
    '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff'
];

irc.styles = [
    {
        name: 'normal',
        style: '',
        key: '\x00'
    },
    {
        name: 'underline',
        style: 'underline',
        key: '\x1F',
        keyregex: /\x1F(.*?)\x1F/,
        bbcode: ['[u]', '[/u]']
    },
    {
        name: 'bold',
        style: 'bold',
        key: '\x02',
        keyregex: /\x02(.*?)\x02/,
        bbcode: ['[b]', '[/b]']
    },
    {
        name: 'italic',
        style: 'italic',
        key: '\x16',
        keyregex: /\x16(.*?)\x16/,
        bbcode: ['[i]', '[/i]']
    },
    {
        name: 'colour',
        style: '',//see below
        key: '\x03',
        fore_re: /^(\d{1,2})/,
        back_re: /^((\d{1,2})+,+(\d{1,2}))/,
        format: "\x03{f},{b}{t}\x03",
        bbcode: ['[colour fore={f} back={b}]', '[/colour]']
    }
];

//dirty but better than filtering every time?
irc.styles.special = _.reject(irc.styles, function(sty) { return sty.name == 'normal' ||  sty.name == 'colour' } );
irc.styles.colour = _.findWhere(irc.styles, {name: 'colour' } );
irc.styles.normal = _.findWhere(irc.styles, {name: 'normal' } );

irc.colours = [//http://www.mirc.com/colors.html
    {
        name: 'white',
        fore: 'col0',
        back: 'back0',
        key: 0
    },
    {
        name: 'black',
        fore: 'col1',
        back: 'back1',
        key: 1
    },
    {
        name: 'navy',
        fore: 'col2',
        back: 'back2',
        key: 2
    },
    {
        name: 'green',
        fore: 'col3',
        back: 'back3',
        key: 3
    },
    {
        name: 'red',
        fore: 'col4',
        back: 'back4',
        key: 4
    },
    {
        name: 'brown',
        fore: 'col5',
        back: 'back5',
        key: 5
    },
    {
        name: 'purple',
        fore: 'col6',
        back: 'back6',
        key: 6
    },
    {
        name: 'olive',
        fore: 'col7',
        back: 'back7',
        key: 7
    },
    {
        name: 'yellow',
        fore: 'col8',
        back: 'back8',
        key: 8,

    },
    {
        name: 'lightgreen',
        fore: 'col9',
        back: 'back9',
        key: 9
    },
    {
        name: 'teal',
        fore: 'col10',
        back: 'back10',
        key: 10
    },
    {
        name: 'cyan',
        fore: 'col11',
        back: 'back11',
        key: 11
    },
    {
        name: 'blue',
        fore: 'col12',
        back: 'back12',
        key: 12
    },
    {
        name: 'pink',
        fore: 'col13',
        back: 'back13',
        key: 13
    },
    {
        name: 'gray',
        fore: 'col14',
        back: 'back14',
        key: 14
    },
    {
        name: 'lightgrey',
        fore: 'col15',
        back: 'back15',
        key: 15
    }
];
irc.Numerics = {
    "001": "RPL_WELCOME",
    "004": "RPL_MYINFO",
    "005": "RPL_ISUPPORT",
    "353": "RPL_NAMREPLY",
    "366": "RPL_ENDOFNAMES",

    "331": "RPL_NOTOPIC",
    "332": "RPL_TOPIC",
    "333": "RPL_TOPICWHOTIME",

    "311": "RPL_WHOISUSER",
    "312": "RPL_WHOISSERVER",
    "313": "RPL_WHOISOPERATOR",
    "317": "RPL_WHOISIDLE",
    "671": "RPL_WHOISSECURE",
    "318": "RPL_ENDOFWHOIS",
    "319": "RPL_WHOISCHANNELS",
    "330": "RPL_WHOISACCOUNT",
    "338": "RPL_WHOISACTUALLY",
    "343": "RPL_WHOISOPERNAME",
    "320": "RPL_WHOISGENERICTEXT",
    "325": "RPL_WHOISWEBIRC",

    "301": "RPL_AWAY",
    "305": "RPL_UNAWAY",
    "306": "RPL_NOWAWAY",

    "324": "RPL_CHANNELMODEIS",
    "329": "RPL_CREATIONTIME",

    "433": "ERR_NICKNAMEINUSE",
    "401": "ERR_NOSUCHNICK",
    "404": "ERR_CANNOTSENDTOCHAN",
    "482": "ERR_CHANOPPRIVSNEEDED",

    "321": "RPL_LISTSTART",
    "322": "RPL_LIST",
    "323": "RPL_LISTEND"
};

irc.Numerics2 = { // from node-irc
    "001": {
        "name": "rpl_welcome",
        "type": "reply"
    },
    "004": {
        "name": "rpl_myinfo",
        "type": "reply"
    },
    "005": {
        "name": "rpl_isupport",
        "type": "reply"
    },
    "200": {
        "name": "rpl_tracelink",
        "type": "reply"
    },
    "201": {
        "name": "rpl_traceconnecting",
        "type": "reply"
    },
    "202": {
        "name": "rpl_tracehandshake",
        "type": "reply"
    },
    "203": {
        "name": "rpl_traceunknown",
        "type": "reply"
    },
    "204": {
        "name": "rpl_traceoperator",
        "type": "reply"
    },
    "205": {
        "name": "rpl_traceuser",
        "type": "reply"
    },
    "206": {
        "name": "rpl_traceserver",
        "type": "reply"
    },
    "208": {
        "name": "rpl_tracenewtype",
        "type": "reply"
    },
    "211": {
        "name": "rpl_statslinkinfo",
        "type": "reply"
    },
    "212": {
        "name": "rpl_statscommands",
        "type": "reply"
    },
    "213": {
        "name": "rpl_statscline",
        "type": "reply"
    },
    "214": {
        "name": "rpl_statsnline",
        "type": "reply"
    },
    "215": {
        "name": "rpl_statsiline",
        "type": "reply"
    },
    "216": {
        "name": "rpl_statskline",
        "type": "reply"
    },
    "218": {
        "name": "rpl_statsyline",
        "type": "reply"
    },
    "219": {
        "name": "rpl_endofstats",
        "type": "reply"
    },
    "221": {
        "name": "rpl_umodeis",
        "type": "reply"
    },
    "241": {
        "name": "rpl_statslline",
        "type": "reply"
    },
    "242": {
        "name": "rpl_statsuptime",
        "type": "reply"
    },
    "243": {
        "name": "rpl_statsoline",
        "type": "reply"
    },
    "244": {
        "name": "rpl_statshline",
        "type": "reply"
    },
    "250": {
        "name": "rpl_statsconn",
        "type": "reply"
    },
    "251": {
        "name": "rpl_luserclient",
        "type": "reply"
    },
    "252": {
        "name": "rpl_luserop",
        "type": "reply"
    },
    "253": {
        "name": "rpl_luserunknown",
        "type": "reply"
    },
    "254": {
        "name": "rpl_luserchannels",
        "type": "reply"
    },
    "255": {
        "name": "rpl_luserme",
        "type": "reply"
    },
    "256": {
        "name": "rpl_adminme",
        "type": "reply"
    },
    "257": {
        "name": "rpl_adminloc1",
        "type": "reply"
    },
    "258": {
        "name": "rpl_adminloc2",
        "type": "reply"
    },
    "259": {
        "name": "rpl_adminemail",
        "type": "reply"
    },
    "261": {
        "name": "rpl_tracelog",
        "type": "reply"
    },
    "265": {
        "name": "rpl_localusers",
        "type": "reply"
    },
    "266": {
        "name": "rpl_globalusers",
        "type": "reply"
    },
    "300": {
        "name": "rpl_none",
        "type": "reply"
    },
    "301": {
        "name": "rpl_away",
        "type": "reply"
    },
    "302": {
        "name": "rpl_userhost",
        "type": "reply"
    },
    "303": {
        "name": "rpl_ison",
        "type": "reply"
    },
    "305": {
        "name": "rpl_unaway",
        "type": "reply"
    },
    "306": {
        "name": "rpl_nowaway",
        "type": "reply"
    },
    "311": {
        "name": "rpl_whoisuser",
        "type": "reply"
    },
    "312": {
        "name": "rpl_whoisserver",
        "type": "reply"
    },
    "313": {
        "name": "rpl_whoisoperator",
        "type": "reply"
    },
    "314": {
        "name": "rpl_whowasuser",
        "type": "reply"
    },
    "315": {
        "name": "rpl_endofwho",
        "type": "reply"
    },
    "317": {
        "name": "rpl_whoisidle",
        "type": "reply"
    },
    "318": {
        "name": "rpl_endofwhois",
        "type": "reply"
    },
    "319": {
        "name": "rpl_whoischannels",
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
        "name": "rpl_liststart",
        "type": "reply"
    },
    "322": {
        "name": "rpl_list",
        "type": "reply"
    },
    "323": {
        "name": "rpl_listend",
        "type": "reply"
    },
    "324": {
        "name": "rpl_channelmodeis",
        "type": "reply"
    },
    "329": {
        "name": "RPL_CREATIONTIME",
        "type": "reply"
    },
    "331": {
        "name": "rpl_notopic",
        "type": "reply"
    },
    "332": {
        "name": "rpl_topic",
        "type": "reply"
    },
    "333": {
        "name": "RPL_TOPICWHOTIME",
        "type": "reply"
    },
    "341": {
        "name": "rpl_inviting",
        "type": "reply"
    },
    "342": {
        "name": "rpl_summoning",
        "type": "reply"
    },
    "351": {
        "name": "rpl_version",
        "type": "reply"
    },
    "352": {
        "name": "rpl_whoreply",
        "type": "reply"
    },
    "353": {
        "name": "rpl_namreply",
        "type": "reply"
    },
    "364": {
        "name": "rpl_links",
        "type": "reply"
    },
    "365": {
        "name": "rpl_endoflinks",
        "type": "reply"
    },
    "366": {
        "name": "rpl_endofnames",
        "type": "reply"
    },
    "367": {
        "name": "rpl_banlist",
        "type": "reply"
    },
    "368": {
        "name": "rpl_endofbanlist",
        "type": "reply"
    },
    "369": {
        "name": "rpl_endofwhowas",
        "type": "reply"
    },
    "371": {
        "name": "rpl_info",
        "type": "reply"
    },
    "372": {
        "name": "rpl_motd",
        "type": "reply"
    },
    "374": {
        "name": "rpl_endofinfo",
        "type": "reply"
    },
    "375": {
        "name": "rpl_motdstart",
        "type": "reply"
    },
    "376": {
        "name": "rpl_endofmotd",
        "type": "reply"
    },
    "381": {
        "name": "rpl_youreoper",
        "type": "reply"
    },
    "382": {
        "name": "rpl_rehashing",
        "type": "reply"
    },
    "391": {
        "name": "rpl_time",
        "type": "reply"
    },
    "392": {
        "name": "rpl_usersstart",
        "type": "reply"
    },
    "393": {
        "name": "rpl_users",
        "type": "reply"
    },
    "394": {
        "name": "rpl_endofusers",
        "type": "reply"
    },
    "395": {
        "name": "rpl_nousers",
        "type": "reply"
    },
    "401": {
        "name": "err_nosuchnick",
        "type": "error"
    },
    "402": {
        "name": "err_nosuchserver",
        "type": "error"
    },
    "403": {
        "name": "err_nosuchchannel",
        "type": "error"
    },
    "404": {
        "name": "err_cannotsendtochan",
        "type": "error"
    },
    "405": {
        "name": "err_toomanychannels",
        "type": "error"
    },
    "406": {
        "name": "err_wasnosuchnick",
        "type": "error"
    },
    "407": {
        "name": "err_toomanytargets",
        "type": "error"
    },
    "409": {
        "name": "err_noorigin",
        "type": "error"
    },
    "411": {
        "name": "err_norecipient",
        "type": "error"
    },
    "412": {
        "name": "err_notexttosend",
        "type": "error"
    },
    "413": {
        "name": "err_notoplevel",
        "type": "error"
    },
    "414": {
        "name": "err_wildtoplevel",
        "type": "error"
    },
    "421": {
        "name": "err_unknowncommand",
        "type": "error"
    },
    "422": {
        "name": "err_nomotd",
        "type": "error"
    },
    "423": {
        "name": "err_noadmininfo",
        "type": "error"
    },
    "424": {
        "name": "err_fileerror",
        "type": "error"
    },
    "431": {
        "name": "err_nonicknamegiven",
        "type": "error"
    },
    "432": {
        "name": "err_erroneusnickname",
        "type": "error"
    },
    "433": {
        "name": "err_nicknameinuse",
        "type": "error"
    },
    "436": {
        "name": "err_nickcollision",
        "type": "error"
    },
    "441": {
        "name": "err_usernotinchannel",
        "type": "error"
    },
    "442": {
        "name": "err_notonchannel",
        "type": "error"
    },
    "443": {
        "name": "err_useronchannel",
        "type": "error"
    },
    "444": {
        "name": "err_nologin",
        "type": "error"
    },
    "445": {
        "name": "err_summondisabled",
        "type": "error"
    },
    "446": {
        "name": "err_usersdisabled",
        "type": "error"
    },
    "451": {
        "name": "err_notregistered",
        "type": "error"
    },
    "461": {
        "name": "err_needmoreparams",
        "type": "error"
    },
    "462": {
        "name": "err_alreadyregistred",
        "type": "error"
    },
    "463": {
        "name": "err_nopermforhost",
        "type": "error"
    },
    "464": {
        "name": "err_passwdmismatch",
        "type": "error"
    },
    "465": {
        "name": "err_yourebannedcreep",
        "type": "error"
    },
    "467": {
        "name": "err_keyset",
        "type": "error"
    },
    "471": {
        "name": "err_channelisfull",
        "type": "error"
    },
    "472": {
        "name": "err_unknownmode",
        "type": "error"
    },
    "473": {
        "name": "err_inviteonlychan",
        "type": "error"
    },
    "474": {
        "name": "err_bannedfromchan",
        "type": "error"
    },
    "475": {
        "name": "err_badchannelkey",
        "type": "error"
    },
    "481": {
        "name": "err_noprivileges",
        "type": "error"
    },
    "482": {
        "name": "err_chanopprivsneeded",
        "type": "error"
    },
    "483": {
        "name": "err_cantkillserver",
        "type": "error"
    },
    "491": {
        "name": "err_nooperhost",
        "type": "error"
    },
    "501": {
        "name": "err_umodeunknownflag",
        "type": "error"
    },
    "502": {
        "name": "err_usersdontmatch",
        "type": "error"
    }
}