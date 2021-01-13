import * as React from 'react';
import styles from './EchoBot.module.scss';
import { IEchoBotProps } from './IEchoBotProps';
import { escape } from '@microsoft/sp-lodash-subset';
import ReactWebChat from 'botframework-webchat';
import { DirectLine } from 'botframework-directlinejs';


export default class EchoBot extends React.Component<IEchoBotProps, {}> {
  private directLine_Secret = "nfRq39L9wkY.XeXCF2XjbxqhonMzxskxYZhucgPkD-kjyGrQuJ_PyBo";
  public render(): React.ReactElement<IEchoBotProps> {
      //Registering to Direct Line to communicate with BOT
      var botConnection = new DirectLine({
        secret: this.directLine_Secret
      });
  
      //Current User information from Context
      var user = { id: this.props.context.pageContext.user.email, name: this.props.context.pageContext.user.displayName };
  
      //Sending BOT "event" type dialog with user basic information for greeting.
      botConnection.postActivity({ type: "event", name: "sendUserInfo", value: this.props.context.pageContext.user.displayName, from: user }).subscribe(id => console.log("success", id));    
  
      //Subscribing for activities created by BOT
      var act: any = botConnection.activity$;
      act.subscribe(
        a => {
          if (a.type == "event" && a.name == "search") {
            botConnection
            .postActivity({ type: "message", text: "showresults", value: [], from: user })
            .subscribe(id => { console.log("success", id); });
          }
        }
      );
    return (
      <div className={styles.echoBot} style={{ height: 700 }}>
      <ReactWebChat botConnection={botConnection} adaptiveCardsHostConfig={null} directLine={{ secret: this.directLine_Secret }} bot={{ id: 'botid' }} user={user} />
    </div>
    );
  }
}
