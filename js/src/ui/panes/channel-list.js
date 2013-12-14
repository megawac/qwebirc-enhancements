ui.ChannelList = new Class({
    Extends: PanelView,
    options: {
        pane: 'channel-list',
        events: {
            'click:relay(.refresh)': 'postRender',
            'keypress:relay(input.filter)': 'update',
            'change:relay(input.filter)': 'update',

            'click:relay(.internal,.chan)': 'join',
            'dblclick:relay(.channels [data-channel])': 'join'
        },
        limit: 100,
        chanmask: '',
        topicmask: '',

        onJoin: function(e,target) {
            this.fireEvent("addChannel", target.get("data-channel") || target.val() || target.get("href"));
        }
    },

    postRender: function() {
        var self = this,
            options = self.options;

        qwebirc.irc.atheme.channelList(function(channels) {
            self.chanList = channels.map(function(channel) {
                return _.assign(channel, "topic", util.urlifier.parse(channel.topic));//urlify the channel - doesn't do colours yet
            });
            self.update();
        }, 0, options.limit, 1, options.chanmask, options.topicmask);
    },

    update: _.debounce(function() {
        var self = this;
        var userFilter = self.element.getElement("input.filter").val();
        getTemplate("channel-list-content", function(template) {
            self.element.getElement(".channels tbody").html(template({
                channels: self.chanList.filter(function(chan) {
                    return !userFilter || chan.name.contains(userFilter) || chan.topic.contains(userFilter);
                })
            }));
        });
    }, 50)
});