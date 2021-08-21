import { ChatUI, LinksUI, UserUI } from "./scripts/ui";
import Chatroom from "./scripts/chat";
import Auth from "./scripts/auth";
import "./styles/style.css";

// dom queries
const adminForm = document.querySelector("#admin-actions");
const signupForm = document.querySelector("#signup-form");
const loginForm = document.querySelector("#login-form");
const rooms = document.querySelector(".chat-rooms");
const chatList = document.querySelector(".chat-list");
const newChatForm = document.querySelector(".new-chat");
const modals = document.querySelectorAll(".modal");
const buttons = document.querySelectorAll(".btns a");
const menu = document.querySelector(".dropdown-menu .btns");
const linksIn = document.querySelectorAll(".link-in");
const dropdown = document.querySelector(".dropdown");
const userContent = document.querySelector(".user");

// class instances
const chatUI = new ChatUI(chatList);
const linksUI = new LinksUI(buttons, menu);
const chatroom = new Chatroom("general", localStorage.username);
const userUI = new UserUI(userContent);


// user changes
auth.onAuthStateChanged((_user) => {
  if (_user) {
    const user = auth.currentUser;
    user.value = _user;
    // check if is admin
    user.getIdTokenResult().then((idTokenResult) => {
      user.admin = idTokenResult.claims.admin;
      userUI.render(user);
      linksUI.setup(user);
    });
  } else {
    linksUI.setup();
    linksUI.clear();
    localStorage.username = "Anonymous";
  }
});

//

// add admin cloud functions
adminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const adminEmail = adminForm["admin-email"].value.trim();
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail })
    .then(() => {
      const modal = document.querySelector("#modal-details");
      modal.classList.remove("is-active");
      adminForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = signupForm["signup-name"].value.trim();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // Pattern for check correctness user
  const usernamePattern = /^[a-zA-Z]{2,12}$/;
  const emailPattern = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  // Error feedback
  let feedback = signupForm.querySelector(".error");

  if (usernamePattern.test(name)) {
    if (emailPattern.test(email)) {
      const user = {
        email,
        password,
        name,
      };

      const signup = new Auth(user);
      signup
        .signUp()
        .then((result) => {
          const displayName = result.user;
          const modal = document.querySelector("#modal-signup");
          const username = document.querySelectorAll(".username");
          username.forEach((name) => {
            name.textContent = displayName.displayName;
          });
          modal.classList.remove("is-active");
          chatroom.updateName(displayName.displayName);
          signupForm.reset();
          chatUI.clear();
          chatroom.updateRoom("general");
          getAndRenderChats();
          feedback.textContent = "";
        })
        .catch((err) => {
          feedback.textContent = err.message;
        });
    } else {
      feedback.textContent = "Invalid email address";
    }
  } else {
    feedback.textContent =
      "Name must contain letters only and be between 2-12 characters long ";
  }
});

// login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  const user = {
    email,
    password,
  };

  const login = new Auth(user);
  login
    .login()
    .then((cred) => {
      const modal = document.querySelector("#modal-login");
      modal.classList.remove("is-active");
      // update name via chatroom
      chatroom.updateName(cred.user.displayName);
      //   reset the form
      loginForm.reset();
      chatUI.clear();
      chatroom.updateRoom("general");
      getAndRenderChats();
      querySelector(".error").textContent = "";
    })
    .catch((err) => {
      loginForm.querySelector(".error").textContent = err.message;
    });
});

// open modal
buttons.forEach((b) => {
  const modal = document.getElementById(b.getAttribute("data-target"));
  if (modal != null) {
    b.addEventListener("click", () => {
      modal.classList.add("is-active");
    });
  } else {
    const logout = new Auth();
    // logout
    b.addEventListener("click", (e) => {
      e.preventDefault();
      logout.logout().then(() => {
        chatroom.updateName("Anonymous");
        chatUI.clear();
        chatroom.updateRoom("general");
        getAndRenderChats();
      });
    });
  }
});

// close modal
modals.forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target.className === "modal-background") {
      m.classList.remove("is-active");
    }
  });
});

// links signup and login
linksIn.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    modals.forEach((modal) => {
      const id = modal.getAttribute("id");
      if (id === "modal-signup" || id === "modal-login") {
        if (e.target.dataset.target) {
          if (modal.classList.contains("is-active")) {
            modal.classList.remove("is-active");
          } else {
            modal.classList.add("is-active");
          }
        }
      }
    });
  });
});

// open a dropdown
dropdown.addEventListener("click", () => {
  dropdown.classList.toggle("is-active");
});
// close dropdown
window.onclick = (event) => {
  if (!event.target.matches(".dropdown-trigger button")) {
    if (dropdown.classList.contains("is-active")) {
      dropdown.classList.remove("is-active");
    }
  }
};

// add a new chat
newChatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const messagePattern = /^[a-zA-Z0-9!@#$%^&*()\\ -_+=~{}\\/"':;?.,]{1,100}$/;

  const message = newChatForm.message.value.trim();
  if (message.length && messagePattern.test(message)) {
    chatroom
      .addChat(message)
      .then(() => {
        newChatForm.reset();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

// delete chat
chatList.addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    const elem = e.target.parentElement;
    chatroom.removeChat(elem.getAttribute("id")).then(() => {
      elem.remove();
    });
  }
});

// update the chat room
rooms.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    chatUI.clear();
    chatroom.updateRoom(e.target.getAttribute("id"));
    getAndRenderChats();
  }
});

// get chats and render
const getAndRenderChats = () => {
  chatroom.getChats((chat) => {
    chatUI.render(chat);
    chatList.parentElement.scroll({
      top: chatList.parentElement.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  });
};

getAndRenderChats();