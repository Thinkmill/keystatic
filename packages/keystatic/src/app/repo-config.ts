export type RepoConfig =
  | `${string}/${string}`
  | { owner: string; name: string };

export function parseRepoConfig(repo: RepoConfig) {
  if (typeof repo === 'string') {
    const [owner, name] = repo.split('/');
    return { owner, name };
  }
  return repo;
}

export function serializeRepoConfig(repo: RepoConfig) {
  if (typeof repo === 'string') {
    return repo;
  }
  return `${repo.owner}/${repo.name}`;
}

export function assertValidRepoConfig(repo: RepoConfig) {
  if (typeof repo === 'string') {
    if (!repo.includes('/')) {
      throw new Error(
        `Invalid repo config: ${repo}. It must be in the form owner/name`
      );
    }
  }
  if (typeof repo === 'object') {
    if (!repo.owner && !repo.name) {
      throw new Error(`Invalid repo config: owner and name are missing`);
    }
    if (!repo.owner) {
      throw new Error(`Invalid repo config: owner is missing`);
    }
    if (!repo.name) {
      throw new Error(`Invalid repo config: name is missing`);
    }
  }
}
