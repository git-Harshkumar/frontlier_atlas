import { formatDistanceToNow } from "date-fns";
export const getGithubTrending = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = yesterday.toISOString().split("T")[0];

  const response = await fetch(
    `https://api.github.com/search/repositories?q=artificial-intelligence+language:Python+stars:>5000&sort=updated&order=desc&per_page=5`,
    {
      headers: {
        "User-Agent": "FrontierAtlas",
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
  const error = await response.text();
  throw new Error(error);
}
  const data = await response.json();

  return data.items.map((repo: any) => ({
  platform: "github",
  source: repo.owner.login,
  time: formatDistanceToNow(new Date(repo.updated_at), {
  addSuffix: true,
}),
  title: `${repo.name} has recent development activity`,
  likes: repo.stargazers_count.toLocaleString(),
  comments: repo.forks_count.toLocaleString(),
    url: repo.html_url,
}));
};