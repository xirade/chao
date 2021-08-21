class Auth {
  constructor(user) {
    this.user = user;
  }

  async signUp() {
    const user = this.user;
    const signUp = await auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
    await signUp.user.updateProfile({ displayName: user.name });
    return signUp;
  }

  async login() {
    const user = this.user;
    const signIn = await auth.signInWithEmailAndPassword(
      user.email,
      user.password
    );
    return signIn;
  }

  async logout() {
    const log = await auth.signOut();
    return log;
  }
}

export default Auth;
