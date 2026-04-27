let io = null;

export const setIO = (newIO) => {
    io = newIO;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
