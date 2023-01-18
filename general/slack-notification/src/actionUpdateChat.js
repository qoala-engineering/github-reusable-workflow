/**
 * Business Logic for executing the Update Chat actions.
 *
 * @param {*} { core, slack, inputs, owner, repo }
 */
async function actionUpdateChat({ core, slack, inputs, owner, repo }) {
  if (
    inputs.slackTs === "" ||
    inputs.slackBlocks === "" ||
    inputs.slackStatusMessage === ""
  ) {
    throw Error(
      "Parameter 'slack_ts' / 'slack_blocks' / 'slack_status_message' are missing.",
    );
  }

  const jobUrl = `https://github.com/${owner}/${repo}/actions/runs/${inputs.jobActionId}`;
  core.debug(`Job URL: ${jobUrl}`);

  const slackResponse = await slack.chat.update({
    channel: inputs.slackChannelId,
    ts: inputs.slackTs,
    blocks: inputs.slackBlocks.replace(
      "{{status}}",
      `${inputs.slackStatusMessage} | <${jobUrl}|GitHub Actions>`,
    ),
  });

  core.debug("Slack Response:");
  core.debug(slackResponse);

  if (inputs.slackThread !== "") {
    const slackThreadResponse = await slack.chat.postMessage({
      channel: inputs.slackChannelId,
      text:
        inputs.slackThread === "start"
          ? ":arrow_forward: The Deployment is *STARTING* now."
          : inputs.slackThread === "finish"
          ? ":white_check_mark: The Deployment is *DONE*. Thank you. :tada:"
          : inputs.slackStatusMessage,
      thread_ts: inputs.slackTs,
    });

    core.debug("Slack Thread Response:");
    core.debug(slackThreadResponse);
  }
}

module.exports = actionUpdateChat;
