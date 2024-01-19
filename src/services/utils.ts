// todo: записывать в базу id аккаунтов и делать проверку
import {addMinutes, format} from "date-fns";

export const isAdmin = (username) => process.env.ADMINS.includes(username);

export const getPlusTimeDate = (date: Date, hours: string, minutes: string) => {
  const addedTime =  Number(hours) * 60 + (Number(minutes) || 0);
  return format(addMinutes(date, addedTime), 'k:mm');
}
