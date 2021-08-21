class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection("chats");
    this.unsub;
  }

  async addChat(message) {
    // format a chat object
    const now = new Date();
    const chat = {
      message,
      username: this.username ? this.username : "Anonymous",
      room: this.room,
      createdAt: firebase.firestore.Timestamp.fromDate(now),
    };
    // save the chat document
    const res = await this.chats.add(chat);
    return res;
  }

  async removeChat(chatId) {
    try {
      const res = await this.chats.doc(chatId).delete();
      return res;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateChat(chatId) {
    try {
      const res = await this.chats.doc(chatId).update()
      return res;
    } catch (error) {
      console.log(error.message)
    }
  }

  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("createdAt")
      // realtime listener
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if(change.type === 'added'){
            callback({...change.doc.data(), id: change.doc.id})
          }
        });
      });
  }

  updateName(username) {
    this.username = username;
    localStorage.setItem("username", username);
  }

  updateRoom(room) {
    this.room = room;
    // unsubscribe from changes
    if (this.unsub) {
      this.unsub();
    }
  }
}

export default Chatroom;
