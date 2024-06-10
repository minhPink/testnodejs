const Chat = require("../../models/chat.model");
const uploadToCloudDinary = require("../../helpers/uploadCloudDinary");
module.exports = async (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) => {
            let images = [];

            for(const imagesBuffer of data.images) {
                const link = await uploadToCloudDinary(imagesBuffer);
                images.push(link);
            }

            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });
            await chat.save();
            // Trả data về client
            _io.emit("SERVER_RETURN_MESSAGE", {
                user_id: userId,
                fullName: fullName,
                content: data.content,
                images: images
            })
        });

        socket.on("SERVER_SEND_TYPING", (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING", {
                user_id: userId,
                fullName: fullName,
                type: type
            })
        })
    });
} 