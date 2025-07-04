const SocialButtons=({onPress})=>{
    return(
        <fieldset className="social">
            <legend>log In With</legend>
                      <button
                className="social-btn google"
                onClick={(e) => {
                  e.preventDefault();
                  onPress("google");
                }}
              >
                <i className="fa-brands fa-google"></i>Google
              </button>
              <button
                className="social-btn github"
                onClick={(e) => {
                  e.preventDefault();
                  onPress("github");
                }}
              >
                <i className="fa-brands fa-github"></i>Github
              </button>
        </fieldset>
    )
}
export default SocialButtons;