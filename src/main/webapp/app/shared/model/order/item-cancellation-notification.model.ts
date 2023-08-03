export interface IItemCancellationNotification {
  id?: string;
  createdBy?: string | null;
  notifiedTime?: string;
  quantity?: number | 0;
}

export const defaultValue: Readonly<IItemCancellationNotification> = {};
