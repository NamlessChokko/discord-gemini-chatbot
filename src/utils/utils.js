module.exports = {
    substitute_mention_usernames(content, mentions) {
        if (!mentions || mentions.size === 0) {
            return content;
        }

        for (const user of mentions.values()) {
            const regex = new RegExp(`<@!?${user.id}>`, 'g');
            content = content.replace(regex, user.username);
        }

        return content;
    },

    substitute_names_with_mentions(content, mentions) {
        if (!mentions || mentions.size === 0) {
            return content;
        }

        for (const user of mentions.values()) {
            const regex = new RegExp(`\\b${user.username}\\b`, 'gi');
            content = content.replace(regex, `<@${user.id}>`);
        }

        return content;
    },
};