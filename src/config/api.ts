export interface ApiConfig {
	baseUrl: string;
	browserWidth: number;
	browserHeight: number;
}

/** EcoIndex API client settings (shared by browser scripts). */
export const api: ApiConfig = {
	baseUrl: 'https://api.ecoindex.fr/v1/',
	browserWidth: 1920,
	browserHeight: 1080,
};
