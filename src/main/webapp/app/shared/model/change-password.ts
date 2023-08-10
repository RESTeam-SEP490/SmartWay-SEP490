export interface IChangePassword {
  currentPassword?: string;
  newPassword?: string;
}

export const defaultValue: Readonly<IChangePassword> = {
  currentPassword: '',
  newPassword: '',
};
