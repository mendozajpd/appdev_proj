const Register = () => {
    return ( 
        <div class="register-body">
        <div class="container">
          <div class="header">
            <div class="buttons">
              <h1>Sign up to start LISTENING</h1>
              <div class="button-container">
                <button class="social-button">
                  <img src={process.env.PUBLIC_URL + '/register/google.png'} alt="Google Logo"/>
                  Login with Google
                </button>
              </div>
              <div class="button-container">
                <button class="social-button">
                <img src={process.env.PUBLIC_URL + '/register/facebook.png'}alt="Facebook Logo" />
                  Login with Facebook
                </button>
              </div>
              <div class="button-container">
                <button class="social-button">
                  <img src={process.env.PUBLIC_URL + '/register/apple.png'} alt="Apple Logo"/>
                  Continue with Apple
                </button>
              </div>
            </div>
          </div>
    
          <div class="main-content">
            <div class="signup">
              <h2>Sign up with</h2>
            </div>
            <div class="email">
              <h3>Email or Username</h3>
            </div>
            <div class="textbox-container">
              <input type="text"/>
              <button class="login-button">Register</button>
            </div>
            <div class="line"></div>
            <p>Don't have an account? Sign up for MediaHarbor</p>
          </div>
        </div>
      </div>
     );
}
 
export default Register;