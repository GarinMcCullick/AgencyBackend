import mongoose from "mongoose";

const user = new mongoose.Schema({
    discordId: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    }
})

export default mongoose.model("User", user)