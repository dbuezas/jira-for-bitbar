module.exports = {
  protocol: 'https',
  host: 'my-company.atlassian.net',
  user: 'myUserame',
  password: 'myPassword',
  queries: [{
    name: 'Blocker',  color: 'red', menuIcon: '⛔️',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status in (backlog, "in development") AND priority=highest',
  }, {
    name: 'in Dev', color: 'orange',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status in ("in development")',
  }, {
    name: 'in Backlog', color: 'blue',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status in (backlog)',
  },{
    name: 'all ToDos', color: 'blue', compact: true, menuIcon: '🖥',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status in (backlog, "in development")',
  }, {
    name: 'Done this week', color: 'green', menuIcon: '✅',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status not in (backlog, "in development") AND updated >= startOfWeek()',
  }, {
    name: 'In Any Project', compact: true,
    query: 'assignee in(currentUser()) AND status in (backlog, "in development")',
  }, {
    name: 'Stories',
    query: 'assignee in(currentUser()) AND sprint in openSprints() AND project=SCA AND status in (backlog, "in development") AND issuetype=story',
  }]
};
