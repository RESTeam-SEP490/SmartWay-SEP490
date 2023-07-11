export interface IZone {
  id?: string;
  name?: string | null;
}

export const defaultValue: Readonly<IZone> = {
  id: '',
  name: '',
};
