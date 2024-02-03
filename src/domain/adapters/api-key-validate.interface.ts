export interface IApiKeyValidateService {
  isValid(key: string): Promise<boolean>;
}
