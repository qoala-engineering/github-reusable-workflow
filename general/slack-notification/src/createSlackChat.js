const os = require("os");

const blocks = require("./blocks.json");
const constants = require("./constants");
const updateIssue = require("./updateIssue");

async function createSlackChat({
  core,
  octokit,
  metadata,
  slack,
  inputs,
  owner,
  repo,
  issueDescription,
}) {
  const [, publisherTeam] = /__publisherTeam:(.+)/.exec(metadata);
  const [, deployedAt] = /__deployedAt:(.+)/.exec(metadata);
  const [, releaseDocs] = /__releaseDocs:(.+)/.exec(metadata);
  const [, releaseNotes] = /__releaseNotes:(.+)/.exec(metadata);
  const [, audiences] = /__audiences:(.+)/.exec(metadata);

  core.debug(`Publisher Team: ${publisherTeam}`);
  core.debug(`Deployed At: ${deployedAt}`);
  core.debug(`Release Docs: ${releaseDocs}`);
  core.debug(`Release Notes: ${releaseNotes}`);
  core.debug(`Audiences: ${audiences}`);

  const serviceUrl = `https://github.com/${owner}/${repo}`;

  const stringifiedBlocks = JSON.stringify(blocks)
    .replace("{{publisherTeam}}", publisherTeam)
    .replace("{{serviceUrl}}", serviceUrl)
    .replace("{{serviceName}}", repo)
    .replace("{{deployedAt}}", deployedAt)
    .replace("{{releaseNotes}}", releaseNotes)
    .replace("{{releaseDocs}}", releaseDocs)
    .replace("{{audiences}}", audiences);

  core.debug(`Raw blocks: ${stringifiedBlocks}`);

  const slackResponse = await slack.chat.postMessage({
    channel: inputs.slackChannelId,
    text: `Release Checklist Info for ${repo} - ${deployedAt}`,
    blocks: stringifiedBlocks.replace(
      "{{status}}",
      `:white_circle: In Pull Request | <${serviceUrl}/pull/${inputs.issueId}|GitHub PR>`,
    ),
  });

  core.debug("Slack Response:");
  core.debug(slackResponse);

  core.info("Update issue with the slack TS metadata");
  await updateIssue({
    owner,
    repo,
    octokit,
    issueId: inputs.issueId,
    issueDescription: issueDescription.replace(
      constants.REGEX_METADATA,
      "___BEGIN_SLACK_METADATA___" +
        os.EOL +
        `__slackTs:${slackResponse.ts}` +
        os.EOL +
        `__blocks:${stringifiedBlocks}` +
        os.EOL +
        "___END_SLACK_METADATA___",
    ),
  });
}

module.exports = createSlackChat;
