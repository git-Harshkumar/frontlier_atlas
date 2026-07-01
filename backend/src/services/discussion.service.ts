import { getGithubTrending } from "./github.service.js";

export const getDiscussions = async () => {
  const github = await getGithubTrending();

  return github;
};