import MessageContent from './messageContent'
import MessagePayload from './messagePayload';
import MessageContentType from './messageContentType';

export default class TextMessageContent extends MessageContent {
    content;

    constructor(content, mentionedType = 0, mentionedTargets = []) {
        super(MessageContentType.Text, mentionedType, mentionedTargets);
        this.content = content;
    }

    digest() {
        return this.content;
    }

    encode() {
        let payload = super.encode();
        payload.searchableContent = this.content;
        return payload;
    };

    decode(payload) {
        super.decode(payload);
        this.content = payload.searchableContent;
    }


}