

export const oneYearFromNow = () => {
    const now = new Date();
    return new Date(now.setFullYear(now.getFullYear() + 1));
};


export const twentyFourHoursFromNow = () => {
    const now = new Date();
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
};

export const thirtyDaysFromNow = () => {
    const now = new Date();
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
};

export const fifteenMinutesFromNow = () => {
    const now = new Date();
    return new Date(now.getTime() + 15 * 60 * 1000); // 15 mins in milliseconds
};

