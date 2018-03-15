from slackclient import SlackClient
import traceback
from config.config import config


def slack_debug(message):
    try:
        slack_token = ""
        sc = SlackClient(config.get('SLACK', 'token'))
        sc.api_call(
            "chat.postMessage",
            channel=config.get('SLACK', 'channel'),
            text=message,
            mrkdwn=True,
            attachments=[]
        )
    except Exception as e:
        print(traceback.format_exc())
