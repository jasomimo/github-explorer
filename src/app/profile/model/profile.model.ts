export interface ProfileResponse {
    login: string,
    id: number,
    avatar_url: string,
    url: string,
    followers_url: string,
    repos_url: string,
    name: string,
    location: string,
    public_repos: number,
    followers: number,
    created_at: string
};

export interface Profile {
    id: number,
    avatarUrl: string,
    login: string,
    name: string,
    location: string,
    registrationDate: Date,
    repositoriesCount: number,
    repositoriesUrl: string,
    followersCount: number,
    followersUrl: string
}