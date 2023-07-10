export interface IRole {
  id?: string;
  name?: string | null;
  authorities?: string[] | null;
}

export const defaultValue: Readonly<IRole> = {
  id: null,
  name: '',
  authorities: [],
};
