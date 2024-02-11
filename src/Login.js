const Login = () => {
  return (
    <div>
      <div
        class="logo"
        // style="align-items: start; padding-top: 30px; margin-left: 20px;"
      >
        <img src="img/logo.png" alt="Logo" width="130" height="130" />
      </div>

      <div class="main-container">
        <div class="container">
          <div class="header">
            <div class="buttons">
              <h1>
                Sign up to start <span>LISTENING</span>
              </h1>
            </div>

            <div class="button-container">
              <button class="social-button">
                <img src="img/google.png" alt="Google Logo" />
                Login with Google
              </button>
            </div>
            <div class="button-container">
              <button class="social-button">
                <img src="img/facebook.png" alt="Facebook Logo" />
                Login with Facebook
              </button>
            </div>
            <div class="button-container">
              <button class="social-button">
                <img src="img/apple.png" alt="Apple Logo" />
                Continue with Apple
              </button>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="line"></div>
          <form>
            <div class="form-group">
              <label for="email">Email or username</label>
              <input type="email" class="form-control" id="email" />
            </div>
            <div class="form-group">
              <label for="pwd">Password</label>
              <input type="password" class="form-control" id="pwd" />
            </div>
            <div class="checkbox">
              <div class="remember-me">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <button
                  type="forgotpassword"
                  class="btn forgotpassword"
                //   style="text-decoration: underline;"
                >
                  <em>Forgot password?</em>
                </button>
              </div>
            </div>
            <button class="login-button">Login</button>
            <div class="line"></div>
            <div class="signup-text">
              <p>Didn't have an account?</p>
              <button
                type="signup"
                class="btn signup"
                // style="text-decoration: underline; color: #a9a9a9;"
              >
                Sign up here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
