export class RepositoryColumn {
    public static readonly id = 'id';
    public static readonly full_name = 'full_name';
    public static readonly html_url = 'html_url';
    public static readonly created = 'created';
    public static readonly updated = 'updated';
    public static readonly stargazers_count = 'stargazers_count';
    public static readonly watchers_count = 'watchers_count';
    public static readonly forks_count = 'forks_count';
}

export interface RepositoryResponse {
    id: number,
    name: string,
    html_url: string,
    created_at: string,
    updated_at: string,
    stargazers_count: number,
    watchers_count: number,
    forks_count: number
}