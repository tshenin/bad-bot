// todo: записывать в базу id аккаунтов и делать проверку
export const isAdmin = (username) => process.env.ADMINS.includes(username);

