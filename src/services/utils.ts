export const isAdmin = (id) => {
    try {
        const admins: string[] = JSON.parse(process.env.ADMINS);
        return admins.includes(id);
    } catch(e) {
        console.error(e);
    }

    return false;
};
