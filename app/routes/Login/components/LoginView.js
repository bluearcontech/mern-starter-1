import React, { Component, PropTypes } from 'react'
import FormGroup from './FormGroup'
import Style from '../style.scss'

class LoginView extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }

    this.handleChangeUsername = this.handleChangeUsername.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  validateUsername = (username) => {
    if (!username.length) {
      return 'Username is required.'
    }
    return true
  }

  validatePassword = (password) => {
    if (!password.length) {
      return 'Password is required.'
    }
    return true
  }

  handleChangeUsername(username) {
    this.setState({
      username,
    })
  }

  handleChangePassword(password) {
    this.setState({
      password,
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const isUsernameValid = this.validateUsername(this.state.username)
    const isPasswordValid = this.validatePassword(this.state.password)

    if (isUsernameValid !== true || isPasswordValid !== true) {
      return
    }

    const { username, password } = this.state
    this.props.onSubmit(username, password)
  }

  render() {
    const isUsernameValid = this.validateUsername(this.state.username)
    const isPasswordValid = this.validatePassword(this.state.password)
    const isSubmitDisabled = isUsernameValid !== true || isPasswordValid !== true

    return (
      <div className="row">
        <div className="col-sm-6 col-sm-offset-3">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Login</h3>
            </div>
            <div className="panel-body">
              <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <FormGroup
                  type="text"
                  id="username"
                  label="Username"
                  validate={this.validateUsername}
                  onChange={this.handleChangeUsername}
                />
                <FormGroup
                  type="password"
                  id="password"
                  label="Password"
                  validate={this.validatePassword}
                  onChange={this.handleChangePassword}
                />
                <div className={`form-group ${!this.props.error ? Style.noMb : ''}`}>
                  <div className="col-sm-9 col-sm-offset-3">
                    <button type="submit" className="btn btn-default" disabled={isSubmitDisabled}>Login</button>
                  </div>
                </div>
                {
                  this.props.error &&
                  <div className={`form-group ${Style.noMb}`}>
                    <div className="col-sm-9 col-sm-offset-3">
                      <p className={`text-danger ${Style.noMb}`}>
                        {this.props.error}
                      </p>
                    </div>
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginView
