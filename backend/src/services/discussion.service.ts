import { getGithubTrending } from "./github.service.js";
import { getRedditTrending } from "./reddit.service.js";

export const getDiscussions = async () => {
  const github = await getGithubTrending();
  const reddit = await getRedditTrending();

return [...github, ...reddit];
};