import img from "../img/person.svg";
class ChatUI {
  constructor(list) {
    this.list = list;
  }

  clear() {
    this.list.innerHTML = "";
  }

  render(data) {
    const formatedTime = dateFns.distanceInWordsToNow(data.createdAt.toDate(), {
      addSuffix: true,
    });
    const html = `
            <li id="${data.id}" class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img class="is-rounded" src="${img}">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="is-size-5 is-capitalized has-text-weight-semibold">${data.username}</p>
                    <span class="is-size-6">${data.message}</span>
                    <div class="is-size-7 has-text-grey-light">${formatedTime}</div>
                </div>
                ${auth.currentUser && auth.currentUser.admin != null ? `<a class="admin button del is-small is-rounded has-text-danger py-4">
                <span class="icon">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                  </span> 
                </a>` : ``}
            </li>
        `;
    this.list.innerHTML += html;
  }
}

class UserUI {
  constructor(userContent) {
    this.userContent = userContent;
  }
  clear() {
    this.userContent.innerHTML = "";
  }
  render(user) {
    const adminItems = document.querySelectorAll(".admin");
    if (user) {
      if (user.admin) {
        adminItems.forEach((item) => item.classList.remove("is-hidden"));
      } else {
        adminItems.forEach((item) => item.classList.add("is-hidden"));
      }
      const html = `
      <div class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img class="is-rounded" src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
          </figure>
        </div>
        <div class="media-content">
          <p class="username title is-4">${user.displayName}</p>
          <p class="subtitle is-7">${user.email}</p>
        </div>
      </div>
      <div class="content mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris.
      </div>
    `;
      this.userContent.innerHTML = html;
    }
  }
}

class LinksUI {
  constructor(links, menu) {
    this.links = links;
    this.menu = menu;
  }

  clear() {
    this.menu.firstChild.remove();
  }
  setup(user) {
    // create
    const div = document.createElement("div");
    div.className = "dropdown-item";
    if (user) {
      const html = `
      <p>You are welcome <span class="username has-text-weight-semibold">${user.displayName}</span>!</p>
      <hr class="dropdown-divider" />
      `;
      div.innerHTML = html;
      this.menu.prepend(div);

      this.links.forEach((item) => {
        if (item.classList.contains("logged-out")) {
          item.classList.add("is-hidden");
        } else {
          item.classList.remove("is-hidden");
        }
      });
    } else {
      div.innerHTML = "";
      this.links.forEach((item) => {
        if (item.classList.contains("logged-in")) {
          item.classList.add("is-hidden");
        } else {
          item.classList.remove("is-hidden");
        }
      });
    }
  }
}

export { ChatUI, LinksUI, UserUI };
