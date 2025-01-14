import MessageContentType from "../messageContentType";

import GroupNotificationContent from "./groupNotification";
import StringUtils from '../../utils/StringUtil'
import webSocketCli from '../../websocketcli'

export default class ChangeGroupNameNotification extends GroupNotificationContent {
    operator = '';
    name = '';

    constructor(operator, name) {
        super(MessageContentType.ChangeGroupName_Notification);
        this.operator = operator;               
        this.name = name;
    }

    formatNotification() {
        if (this.fromSelf) {
            return '您修改群名称为：' + this.name;
        } else {
            return webSocketCli.getDisplayName(this.operator)+' 修改群名称为:' + this.name;
        }
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            n: this.name,
            o: this.operator,
        };
        payload.binaryContent = StringUtils.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let json = StringUtils.b64_to_utf8(payload.binaryContent)
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.operator = obj.o;
        this.name = obj.n;
    }

}