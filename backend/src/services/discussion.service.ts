import { getGithubTrending } from "./github.service.js";
import { getHackerNewsTrending } from "./hackernews.service.js";

export const getDiscussions = async () => {
  const github = await getGithubTrending();
  const hackernews = await getHackerNewsTrending();

 const all = [...github, ...hackernews];

// Shuffle the array
all.sort(() => Math.random() - 0.5);

return all;
};