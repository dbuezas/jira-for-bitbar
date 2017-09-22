'use strict';
const JiraApi = require('jira-client');
const bitbar = require('bitbar');
const _ = require('lodash');
const log = require('./log');
const { username, password, protocol, host, queries } = require('./credentials');
const nodePath = process.argv[0];
const baseUrl = `${protocol}://${host}`;

const jira = new JiraApi({
  protocol,
  host,
  username,
  password,
  apiVersion: '2',
  strictSSL: true
});

const generateMenu = async () => {
  let menuTitle = { text: '' };
  const menuItemsP = _.map(queries, async ({ name, compact, query, color, menuIcon }) => {
    let options = { fields: ['summary'], maxResults: 20 };
    const { total, issues } = await jira.searchJira(query, options);
    if (menuIcon && total > 0) {
      menuTitle.text += `${menuIcon}${total}`
    }

    const issuesConfPromises = _.map(issues, async ({ key, fields, id }) => {
      let submenu;
      if (!compact) {
        try {
          const { transitions } = await jira.listTransitions(id);
          submenu = _.map(transitions, (transition) => ({
            text: transition.name,
            refresh: true,
            terminal: false,
            bash: nodePath,
            param1: `${__dirname}/index.js`,
            param2: 'transition',
            param3: `${id},${transition.id},${key},${transition.name}`,
          }));
        } catch (e) { /**/ }
      }
      return {
        text: `${key}: ${fields.summary}`,
        href: `${baseUrl}/browse/${key}`,
        submenu,
        color,
      };
    });
    const issuesConf = await Promise.all(issuesConfPromises);
    if (total > issues.length) {
      issuesConf.push({ text: `${total - issues.length} more...` })
    }
    const title = {
      text: `${menuIcon || ''}${name} (${total})`,
      href: `${baseUrl}/issues/?jql=${query}`,
      submenu: (compact ? issuesConf : undefined),
      // color,
    };
    return [
      bitbar.sep,
      title,
      ...(compact ? [] : issuesConf),
    ];
  });

  const menuItems = _.flatten(await Promise.all(menuItemsP));
  menuTitle.text = menuTitle.text || '✅';
  bitbar([
    menuTitle,
    bitbar.sep,
    { text: 'Refresh ♻️', refresh: true, terminal: false },
    ...menuItems,
  ]);
}

const transitionIssue = async (issueId, transitionId) => {
  await jira.transitionIssue(issueId, { transition: { id: transitionId } });
}

if (process.argv[2] === 'transition') {
  log('transition', process.argv.slice(2))
  const [issueId, transitionId] = process.argv[3].split(',');
  transitionIssue(issueId, transitionId);
} else {
  log('generateMenu')
  generateMenu();
}

