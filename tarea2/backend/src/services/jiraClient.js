const JIRA_BASE_URL = (process.env.JIRA_BASE_URL || "http://localhost:8080").replace(
  /\/$/,
  ""
);
const JIRA_USER = process.env.JIRA_USER || "admin";
const JIRA_PASSWORD = process.env.JIRA_PASSWORD || "vana2026";
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "VANA";

function authHeader() {
  const token = Buffer.from(`${JIRA_USER}:${JIRA_PASSWORD}`).toString("base64");
  return `Basic ${token}`;
}

function toAdf(text) {
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: text ? [{ type: "text", text }] : [],
      },
    ],
  };
}

function fromAdf(desc) {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  const parts = [];
  const walk = (node) => {
    if (!node) return;
    if (node.type === "text" && node.text) parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(desc);
  return parts.join(" ");
}

async function jiraFetch(path, options = {}) {
  const res = await fetch(`${JIRA_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message =
      data?.errorMessages?.join("; ") ||
      data?.message ||
      data?.error ||
      `Jira HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function getServerInfo() {
  return jiraFetch("/rest/api/3/serverInfo");
}

function mapIssue(issue) {
  return {
    id: issue.id,
    key: issue.key,
    title: issue.fields.summary,
    status: mapStatus(issue.fields.status?.name),
    statusName: issue.fields.status?.name || "Unknown",
    description: fromAdf(issue.fields.description),
    updatedAt: issue.fields.updated,
    url: `${JIRA_BASE_URL}/browse/${issue.key}`,
  };
}

async function listIssues() {
  const jql = `project = ${JIRA_PROJECT_KEY} ORDER BY updated DESC`;
  const fields = "summary,status,description,updated";
  const qs = new URLSearchParams({
    jql,
    maxResults: "50",
    fields,
  });

  // GET /rest/api/3/search/jql (CHANGE-2046: /search fue eliminado)
  const data = await jiraFetch(`/rest/api/3/search/jql?${qs.toString()}`);
  return (data.issues || []).map(mapIssue);
}

function mapStatus(name = "") {
  const n = name.toLowerCase();
  if (n.includes("done") || n.includes("cerrad") || n.includes("resolved")) {
    return "done";
  }
  if (n.includes("progress") || n.includes("progreso") || n.includes("doing")) {
    return "doing";
  }
  return "todo";
}

async function createIssue({ title, description = "" }) {
  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: title,
      description: toAdf(description),
      issuetype: { name: "Task" },
    },
  };
  const created = await jiraFetch("/rest/api/3/issue", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    id: created.id,
    key: created.key,
    title,
    status: "todo",
    statusName: "To Do",
    description,
    url: `${JIRA_BASE_URL}/browse/${created.key}`,
  };
}

async function getTransitions(issueKey) {
  const data = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
  return data.transitions || [];
}

async function transitionIssue(issueKey, targetColumn) {
  const transitions = await getTransitions(issueKey);
  const wanted =
    targetColumn === "done"
      ? ["done", "cerrado", "resolved", "complete"]
      : targetColumn === "doing"
        ? ["progress", "progreso", "in progress", "doing", "iniciar"]
        : ["to do", "todo", "open", "backlog", "por hacer", "reabrir", "reopen"];

  const match = transitions.find((t) => {
    const name = (t.name || "").toLowerCase();
    const to = (t.to?.name || "").toLowerCase();
    return wanted.some((w) => name.includes(w) || to.includes(w));
  });

  if (!match) {
    throw new Error(
      `No hay transición en Jira hacia "${targetColumn}". Disponibles: ${transitions
        .map((t) => t.name)
        .join(", ")}`
    );
  }

  await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({ transition: { id: match.id } }),
  });

  return { key: issueKey, status: targetColumn, transition: match.name };
}

function getConfigPublic() {
  return {
    baseUrl: JIRA_BASE_URL,
    projectKey: JIRA_PROJECT_KEY,
    user: JIRA_USER,
  };
}

module.exports = {
  getServerInfo,
  listIssues,
  createIssue,
  transitionIssue,
  getConfigPublic,
  JIRA_BASE_URL,
};
